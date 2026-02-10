import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { validateQuery } from "../middleware/validation";

const router = Router();

const searchQuerySchema = z.object({
  q: z.string().min(1),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// GET /api/search?q=
router.get(
  "/",
  validateQuery(searchQuerySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, page, limit } = req.query as unknown as z.infer<
        typeof searchQuerySchema
      >;

      const skip = (page - 1) * limit;

      const where = {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { brand: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
        ],
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
