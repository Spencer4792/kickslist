import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

const FREE_TIER_MAX_DROP_ALERTS = 1;

const createDropAlertSchema = z.object({
  alertType: z.enum(["drop", "restock"]),
  brand: z.string().optional(),
  category: z.string().optional(),
  keywords: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
});

// GET /api/drop-alerts — list user's drop alerts
router.get("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alerts = await prisma.dropAlert.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({ alerts });
  } catch (err) {
    next(err);
  }
});

// POST /api/drop-alerts — create alert with tier enforcement
router.post("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createDropAlertSchema.parse(req.body);

    // Tier enforcement
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { subscriptionTier: true },
    });

    if (user?.subscriptionTier === "free") {
      const activeCount = await prisma.dropAlert.count({
        where: { userId: req.user!.userId, isActive: true },
      });
      if (activeCount >= FREE_TIER_MAX_DROP_ALERTS) {
        throw new AppError(403, "Free tier is limited to 1 active drop alert. Upgrade to Pro for unlimited alerts.");
      }
    }

    const alert = await prisma.dropAlert.create({
      data: {
        userId: req.user!.userId,
        alertType: data.alertType,
        brand: data.brand,
        category: data.category,
        keywords: data.keywords,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
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

// DELETE /api/drop-alerts/:id — delete alert with ownership check
router.delete("/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alertId = parseInt(req.params.id as string, 10);
    if (isNaN(alertId)) {
      throw new AppError(400, "Invalid alert ID");
    }

    const alert = await prisma.dropAlert.findUnique({ where: { id: alertId } });
    if (!alert) {
      throw new AppError(404, "Alert not found");
    }
    if (alert.userId !== req.user!.userId) {
      throw new AppError(403, "Not authorized to delete this alert");
    }

    await prisma.dropAlert.delete({ where: { id: alertId } });

    res.json({ message: "Alert deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
