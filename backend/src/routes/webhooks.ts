import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const GRANT_EVENTS = [
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "PRODUCT_CHANGE",
];
const CANCEL_EVENTS = ["CANCELLATION"];
const REVOKE_EVENTS = ["EXPIRATION", "BILLING_ISSUE"];

function determinePlan(productId: string): "monthly" | "yearly" {
  if (productId.includes("yearly") || productId.includes("annual")) {
    return "yearly";
  }
  return "monthly";
}

router.post("/revenuecat", async (req: Request, res: Response) => {
  // Validate webhook secret
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (secret) {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${secret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    const { event } = req.body;
    if (!event) {
      return res.status(400).json({ error: "Missing event" });
    }

    const eventType: string = event.type;
    const appUserId: string = event.app_user_id;
    const productId: string = event.product_id || "";
    const expirationAtMs: number | null = event.expiration_at_ms ?? null;
    const purchaseDateMs: number | null = event.purchase_date_ms ?? null;

    if (!appUserId) {
      return res.status(400).json({ error: "Missing app_user_id" });
    }

    // Look up user
    const user = await prisma.user.findUnique({ where: { id: appUserId } });
    if (!user) {
      // User not found — acknowledge so RevenueCat doesn't retry
      return res.status(200).json({ message: "User not found, skipping" });
    }

    const plan = determinePlan(productId);
    const periodStart = purchaseDateMs ? new Date(purchaseDateMs) : new Date();
    const periodEnd = expirationAtMs
      ? new Date(expirationAtMs)
      : new Date(Date.now() + (plan === "yearly" ? 365 : 30) * 86400000);

    if (GRANT_EVENTS.includes(eventType)) {
      await prisma.$transaction([
        prisma.subscription.upsert({
          where: {
            id:
              (
                await prisma.subscription.findFirst({
                  where: { userId: appUserId },
                  orderBy: { createdAt: "desc" },
                })
              )?.id ?? 0,
          },
          create: {
            userId: appUserId,
            plan,
            status: "active",
            revenuecatSubscriptionId: event.original_transaction_id || null,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          },
          update: {
            plan,
            status: "active",
            revenuecatSubscriptionId: event.original_transaction_id || null,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          },
        }),
        prisma.user.update({
          where: { id: appUserId },
          data: { subscriptionTier: "pro" },
        }),
      ]);
    } else if (CANCEL_EVENTS.includes(eventType)) {
      // Mark cancelled but user keeps pro until period ends
      const latestSub = await prisma.subscription.findFirst({
        where: { userId: appUserId },
        orderBy: { createdAt: "desc" },
      });
      if (latestSub) {
        await prisma.subscription.update({
          where: { id: latestSub.id },
          data: { status: "cancelled" },
        });
      }
      // User stays pro until EXPIRATION event
    } else if (REVOKE_EVENTS.includes(eventType)) {
      await prisma.$transaction(async (tx) => {
        const latestSub = await tx.subscription.findFirst({
          where: { userId: appUserId },
          orderBy: { createdAt: "desc" },
        });
        if (latestSub) {
          await tx.subscription.update({
            where: { id: latestSub.id },
            data: { status: "expired" },
          });
        }
        await tx.user.update({
          where: { id: appUserId },
          data: { subscriptionTier: "free" },
        });
      });
    }

    return res.status(200).json({ message: "OK" });
  } catch (err) {
    console.error("Webhook error:", err);
    // Return 200 to prevent excessive retries on internal errors
    return res.status(200).json({ message: "Error processed" });
  }
});

export default router;
