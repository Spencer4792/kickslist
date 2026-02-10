import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

const FREE_TIER_MAX_ALERTS = 3;

const createAlertSchema = z.object({
  productId: z.number().int().positive(),
  targetPrice: z.number().positive(),
});

// GET /api/price-alerts — list user's alerts with product data
router.get("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alerts = await prisma.priceAlert.findMany({
      where: { userId: req.user!.userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            brand: true,
            images: true,
            currentLowestPrice: true,
            retailPrice: true,
          },
        },
      },
      orderBy: [{ isTriggered: "asc" }, { createdAt: "desc" }],
    });

    res.json({ alerts });
  } catch (err) {
    next(err);
  }
});

// GET /api/price-alerts/count — active alert count for tier UI
router.get("/count", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await prisma.priceAlert.count({
      where: { userId: req.user!.userId, isTriggered: false },
    });

    res.json({ count });
  } catch (err) {
    next(err);
  }
});

// POST /api/price-alerts — create alert with tier enforcement
router.post("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, targetPrice } = createAlertSchema.parse(req.body);

    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    // Duplicate check: one active alert per product per user
    const existing = await prisma.priceAlert.findFirst({
      where: { userId: req.user!.userId, productId, isTriggered: false },
    });
    if (existing) {
      throw new AppError(409, "You already have an active alert for this product");
    }

    // Tier enforcement
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { subscriptionTier: true },
    });

    if (user?.subscriptionTier === "free") {
      const activeCount = await prisma.priceAlert.count({
        where: { userId: req.user!.userId, isTriggered: false },
      });
      if (activeCount >= FREE_TIER_MAX_ALERTS) {
        throw new AppError(403, "Free tier is limited to 3 active price alerts. Upgrade to Pro for unlimited alerts.");
      }
    }

    const alert = await prisma.priceAlert.create({
      data: {
        userId: req.user!.userId,
        productId,
        targetPrice,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            brand: true,
            images: true,
            currentLowestPrice: true,
            retailPrice: true,
          },
        },
      },
    });

    res.status(201).json({ alert });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    next(err);
  }
});

// DELETE /api/price-alerts/:id — delete alert with ownership check
router.delete("/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alertId = parseInt(req.params.id as string, 10);
    if (isNaN(alertId)) {
      throw new AppError(400, "Invalid alert ID");
    }

    const alert = await prisma.priceAlert.findUnique({ where: { id: alertId } });
    if (!alert) {
      throw new AppError(404, "Alert not found");
    }
    if (alert.userId !== req.user!.userId) {
      throw new AppError(403, "Not authorized to delete this alert");
    }

    await prisma.priceAlert.delete({ where: { id: alertId } });

    res.json({ message: "Alert deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
