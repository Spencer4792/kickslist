import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// All wishlist routes require authentication
router.use(requireAuth);

// GET /api/wishlist
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wishlists = await prisma.wishlist.findMany({
      where: { userId: req.user!.userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      wishlist: wishlists.map((w) => ({
        id: w.id,
        productId: w.productId,
        createdAt: w.createdAt,
        product: w.product,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/wishlist/:productId
router.post("/:productId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.productId as string, 10);
    if (isNaN(productId)) {
      throw new AppError(400, "Invalid product ID");
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    const wishlist = await prisma.wishlist.upsert({
      where: {
        userId_productId: { userId: req.user!.userId, productId },
      },
      create: { userId: req.user!.userId, productId },
      update: {},
      include: { product: true },
    });

    res.status(201).json({ wishlist });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/wishlist/:productId
router.delete("/:productId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.productId as string, 10);
    if (isNaN(productId)) {
      throw new AppError(400, "Invalid product ID");
    }

    await prisma.wishlist.deleteMany({
      where: { userId: req.user!.userId, productId },
    });

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    next(err);
  }
});

const syncSchema = z.object({
  productIds: z.array(z.number().int().positive()),
});

// POST /api/wishlist/sync
router.post("/sync", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productIds } = syncSchema.parse(req.body);
    const userId = req.user!.userId;

    // Get existing server-side wishlist
    const existing = await prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true },
    });
    const existingIds = new Set(existing.map((w) => w.productId));

    // Find new items from client that aren't on server
    const newIds = productIds.filter((id) => !existingIds.has(id));

    // Verify products exist
    if (newIds.length > 0) {
      const validProducts = await prisma.product.findMany({
        where: { id: { in: newIds } },
        select: { id: true },
      });
      const validIds = new Set(validProducts.map((p) => p.id));

      // Create wishlist entries for valid new products
      await prisma.wishlist.createMany({
        data: newIds
          .filter((id) => validIds.has(id))
          .map((productId) => ({ userId, productId })),
        skipDuplicates: true,
      });
    }

    // Return merged wishlist
    const wishlists = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      wishlist: wishlists.map((w) => ({
        id: w.id,
        productId: w.productId,
        createdAt: w.createdAt,
        product: w.product,
      })),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    next(err);
  }
});

export default router;
