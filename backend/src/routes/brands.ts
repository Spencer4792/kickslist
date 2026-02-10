import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// GET /api/brands
router.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const brands = await prisma.product.groupBy({
        by: ["brand"],
        _count: { brand: true },
        orderBy: { _count: { brand: "desc" } },
      });

      res.json({
        brands: brands.map((b) => ({
          name: b.brand,
          count: b._count.brand,
        })),
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
