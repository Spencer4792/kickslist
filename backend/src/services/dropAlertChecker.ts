import { prisma } from "../lib/prisma";
import { sendDropAlertNotifications, DropAlertNotification } from "./pushNotifications";
import { Decimal } from "@prisma/client/runtime/library";

const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check drop and restock alerts against newly ingested products.
 * Called from the feed processor after each sync.
 */
export async function checkDropAlerts(
  newProductIds: number[],
  restockedProductIds: number[]
): Promise<void> {
  if (newProductIds.length === 0 && restockedProductIds.length === 0) return;

  // Load all active drop alerts with user push tokens
  const alerts = await prisma.dropAlert.findMany({
    where: { isActive: true },
    include: {
      user: { select: { pushToken: true } },
    },
  });

  if (alerts.length === 0) return;

  const notifications: DropAlertNotification[] = [];

  // Process new products against "drop" alerts
  if (newProductIds.length > 0) {
    const newProducts = await prisma.product.findMany({
      where: { id: { in: newProductIds } },
    });

    const dropAlerts = alerts.filter((a) => a.alertType === "drop");

    for (const product of newProducts) {
      for (const alert of dropAlerts) {
        if (!matchesCriteria(alert, product)) continue;
        if (isOnCooldown(alert.lastTriggeredAt)) continue;
        if (!alert.user.pushToken) continue;

        notifications.push({
          pushToken: alert.user.pushToken,
          productName: product.name,
          brand: product.brand,
          price: product.currentLowestPrice
            ? Number(product.currentLowestPrice).toFixed(2)
            : null,
          productId: product.id,
          alertType: "drop",
        });

        await prisma.dropAlert.update({
          where: { id: alert.id },
          data: {
            triggeredCount: { increment: 1 },
            lastTriggeredAt: new Date(),
          },
        });
      }
    }
  }

  // Process restocked products against "restock" alerts
  if (restockedProductIds.length > 0) {
    const restockedProducts = await prisma.product.findMany({
      where: { id: { in: restockedProductIds } },
    });

    const restockAlerts = alerts.filter((a) => a.alertType === "restock");

    for (const product of restockedProducts) {
      for (const alert of restockAlerts) {
        if (!matchesCriteria(alert, product)) continue;
        if (isOnCooldown(alert.lastTriggeredAt)) continue;
        if (!alert.user.pushToken) continue;

        notifications.push({
          pushToken: alert.user.pushToken,
          productName: product.name,
          brand: product.brand,
          price: product.currentLowestPrice
            ? Number(product.currentLowestPrice).toFixed(2)
            : null,
          productId: product.id,
          alertType: "restock",
        });

        await prisma.dropAlert.update({
          where: { id: alert.id },
          data: {
            triggeredCount: { increment: 1 },
            lastTriggeredAt: new Date(),
          },
        });
      }
    }
  }

  if (notifications.length > 0) {
    await sendDropAlertNotifications(notifications);
    console.log(`[DropAlerts] Sent ${notifications.length} notification(s)`);
  }
}

/**
 * AND logic: all non-null criteria fields must match.
 */
function matchesCriteria(
  alert: { brand: string | null; category: string | null; keywords: string | null; minPrice: Decimal | null; maxPrice: Decimal | null },
  product: { brand: string; category: string; name: string; currentLowestPrice: Decimal | null }
): boolean {
  if (alert.brand && alert.brand.toLowerCase() !== product.brand.toLowerCase()) {
    return false;
  }

  if (alert.category && alert.category.toLowerCase() !== product.category.toLowerCase()) {
    return false;
  }

  if (alert.keywords) {
    const keywords = alert.keywords.split(",").map((k) => k.trim().toLowerCase());
    const productName = product.name.toLowerCase();
    const hasMatch = keywords.some((kw) => productName.includes(kw));
    if (!hasMatch) return false;
  }

  if (alert.minPrice != null || alert.maxPrice != null) {
    if (product.currentLowestPrice == null) return false;
    const price = Number(product.currentLowestPrice);

    if (alert.minPrice != null && price < Number(alert.minPrice)) return false;
    if (alert.maxPrice != null && price > Number(alert.maxPrice)) return false;
  }

  return true;
}

function isOnCooldown(lastTriggeredAt: Date | null): boolean {
  if (!lastTriggeredAt) return false;
  return Date.now() - lastTriggeredAt.getTime() < COOLDOWN_MS;
}
