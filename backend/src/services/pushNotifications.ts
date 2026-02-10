import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";

const expo = new Expo();

export interface PriceAlertNotification {
  pushToken: string;
  productName: string;
  currentPrice: string;
  targetPrice: string;
  productId: number;
}

export interface DropAlertNotification {
  pushToken: string;
  productName: string;
  brand: string;
  price: string | null;
  productId: number;
  alertType: "drop" | "restock";
}

export async function sendDropAlertNotifications(
  notifications: DropAlertNotification[]
): Promise<void> {
  const messages: ExpoPushMessage[] = [];

  for (const n of notifications) {
    if (!Expo.isExpoPushToken(n.pushToken)) {
      console.warn(`[Push] Invalid Expo push token: ${n.pushToken}`);
      continue;
    }

    const isDrop = n.alertType === "drop";
    const title = isDrop ? "New Drop!" : "Back in Stock!";
    const body = isDrop
      ? `${n.productName} just dropped${n.price ? ` at $${n.price}` : ""}`
      : `${n.productName} is back in stock!`;

    messages.push({
      to: n.pushToken,
      sound: "default",
      title,
      body,
      data: { productId: n.productId, type: isDrop ? "drop_alert" : "restock_alert" },
    });
  }

  if (messages.length === 0) return;

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const ticketChunk: ExpoPushTicket[] = await expo.sendPushNotificationsAsync(chunk);

      for (const ticket of ticketChunk) {
        if (ticket.status === "error") {
          console.error(`[Push] Error sending notification:`, ticket.message);
          if (ticket.details?.error) {
            console.error(`[Push] Error details:`, ticket.details.error);
          }
        }
      }
    } catch (error) {
      console.error("[Push] Error sending chunk:", error);
    }
  }
}

export async function sendPriceAlertNotifications(
  notifications: PriceAlertNotification[]
): Promise<void> {
  const messages: ExpoPushMessage[] = [];

  for (const n of notifications) {
    if (!Expo.isExpoPushToken(n.pushToken)) {
      console.warn(`[Push] Invalid Expo push token: ${n.pushToken}`);
      continue;
    }

    messages.push({
      to: n.pushToken,
      sound: "default",
      title: "Price Drop Alert!",
      body: `${n.productName} dropped to $${n.currentPrice} (your target: $${n.targetPrice})`,
      data: { productId: n.productId, type: "price_alert" },
    });
  }

  if (messages.length === 0) return;

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const ticketChunk: ExpoPushTicket[] = await expo.sendPushNotificationsAsync(chunk);

      for (const ticket of ticketChunk) {
        if (ticket.status === "error") {
          console.error(`[Push] Error sending notification:`, ticket.message);
          if (ticket.details?.error) {
            console.error(`[Push] Error details:`, ticket.details.error);
          }
        }
      }
    } catch (error) {
      console.error("[Push] Error sending chunk:", error);
    }
  }
}
