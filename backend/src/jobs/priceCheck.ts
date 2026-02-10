import cron from "node-cron";
import { prisma } from "../lib/prisma";
import { sendPriceAlertNotifications, PriceAlertNotification } from "../services/pushNotifications";
import { Decimal } from "@prisma/client/runtime/library";

export function startPriceCheckJob() {
  // Run every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    console.log("[PriceCheck] Running...");

    try {
      // Get all active (non-triggered) alerts with product + user data
      const activeAlerts = await prisma.priceAlert.findMany({
        where: { isTriggered: false },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              currentLowestPrice: true,
            },
          },
          user: {
            select: {
              id: true,
              pushToken: true,
            },
          },
        },
      });

      if (activeAlerts.length === 0) {
        console.log("[PriceCheck] No active alerts to check.");
        return;
      }

      const triggeredAlerts: typeof activeAlerts = [];

      for (const alert of activeAlerts) {
        const currentPrice = alert.product.currentLowestPrice;
        if (!currentPrice) continue;

        // Compare using Decimal: currentPrice <= targetPrice
        if (new Decimal(currentPrice.toString()).lte(new Decimal(alert.targetPrice.toString()))) {
          triggeredAlerts.push(alert);
        }
      }

      if (triggeredAlerts.length === 0) {
        console.log("[PriceCheck] No alerts triggered.");
        return;
      }

      console.log(`[PriceCheck] ${triggeredAlerts.length} alert(s) triggered.`);

      // Mark triggered alerts in a transaction
      await prisma.$transaction(
        triggeredAlerts.map((alert) =>
          prisma.priceAlert.update({
            where: { id: alert.id },
            data: {
              isTriggered: true,
              triggeredAt: new Date(),
              triggeredPrice: alert.product.currentLowestPrice!,
            },
          })
        )
      );

      // Send push notifications to users who have push tokens
      const notifications: PriceAlertNotification[] = triggeredAlerts
        .filter((alert) => alert.user.pushToken)
        .map((alert) => ({
          pushToken: alert.user.pushToken!,
          productName: alert.product.name,
          currentPrice: alert.product.currentLowestPrice!.toString(),
          targetPrice: alert.targetPrice.toString(),
          productId: alert.product.id,
        }));

      if (notifications.length > 0) {
        await sendPriceAlertNotifications(notifications);
        console.log(`[PriceCheck] Sent ${notifications.length} push notification(s).`);
      }
    } catch (error) {
      console.error("[PriceCheck] Error:", error);
    }
  });

  console.log("[PriceCheck] Job scheduled — runs every 15 minutes.");
}
