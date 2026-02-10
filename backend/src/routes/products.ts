import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { validateQuery } from "../middleware/validation";
import { AppError } from "../middleware/errorHandler";
import { Prisma } from "@prisma/client";

const router = Router();

const productsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  brand: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(["newest", "price-low", "price-high"]).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

// GET /api/products
router.get(
  "/",
  validateQuery(productsQuerySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, brand, category, sort, minPrice, maxPrice } =
        req.query as unknown as z.infer<typeof productsQuerySchema>;

      const where: Prisma.ProductWhereInput = {};

      if (brand) {
        where.brand = { equals: brand, mode: "insensitive" };
      }
      if (category) {
        where.category = { equals: category, mode: "insensitive" };
      }
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.currentLowestPrice = {};
        if (minPrice !== undefined) {
          where.currentLowestPrice.gte = minPrice;
        }
        if (maxPrice !== undefined) {
          where.currentLowestPrice.lte = maxPrice;
        }
      }

      let orderBy: Prisma.ProductOrderByWithRelationInput = {
        createdAt: "desc",
      };
      if (sort === "newest") {
        orderBy = { releaseDate: "desc" };
      } else if (sort === "price-low") {
        orderBy = { currentLowestPrice: "asc" };
      } else if (sort === "price-high") {
        orderBy = { currentLowestPrice: "desc" };
      }

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: limit,
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

// GET /api/products/featured
router.get(
  "/featured",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await prisma.product.findMany({
        where: { isFeatured: true },
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      res.json({ products });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/products/trending
router.get(
  "/trending",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await prisma.product.findMany({
        where: { isTrending: true },
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      res.json({ products });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/products/:id/related
router.get(
  "/:id/related",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        throw new AppError(400, "Invalid product ID");
      }

      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new AppError(404, "Product not found");
      }

      const products = await prisma.product.findMany({
        where: {
          id: { not: id },
          OR: [
            { brand: product.brand },
            { category: product.category },
          ],
        },
        take: 4,
        orderBy: { createdAt: "desc" },
      });

      res.json({ products });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/products/:id
router.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        throw new AppError(400, "Invalid product ID");
      }

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          vendorPrices: {
            include: {
              vendor: true,
            },
            where: {
              inStock: true,
            },
            orderBy: {
              price: "asc",
            },
          },
        },
      });

      if (!product) {
        throw new AppError(404, "Product not found");
      }

      res.json({ product });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
