import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const [user, subscription] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true },
      }),
      prisma.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.json({
      tier: user?.subscriptionTier || "free",
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
          }
        : null,
    });
  } catch (err) {
    console.error("Subscription status error:", err);
    res.status(500).json({ error: "Failed to fetch subscription status" });
  }
});

export default router;
