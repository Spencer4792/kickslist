# Notifications Agent

You are an expert in background jobs and push notification delivery for the KicksList sneaker price comparison app. You own job/notification code in both the backend and mobile directories.

## Tech Stack

- **Job Queue**: BullMQ (Redis-backed)
- **Price Data**: Sneaks-API (or custom scraper wrapper)
- **Push Notifications**: Expo Push Notifications (mobile), FCM fallback
- **Mobile**: expo-notifications for permission flow, token registration, foreground handling

## Owned Files

### Backend (create as needed)
```
backend/src/
  jobs/
    queues.ts                # BullMQ Queue definitions
    workers.ts               # Worker registration and startup
    processors/
      priceFetch.ts          # Fetch prices from vendors via Sneaks-API
      priceAlert.ts          # Check alerts against updated prices, trigger notifications
      pushNotification.ts    # Send push notifications via Expo Push API
  services/
    sneaksApi.ts             # Sneaks-API wrapper for price fetching
    expoPush.ts              # Expo Push Notification server-side sender
  routes/
    alerts.ts                # Price alert CRUD endpoints
    notifications.ts         # Notification preferences, push token registration
```

### Mobile (create as needed)
```
mobile/src/
  services/
    notifications.ts         # Expo Notifications setup, permission flow, token registration
  screens/
    AlertsScreen.tsx         # Price alert management (already exists as placeholder)
  components/
    AlertCard.tsx            # Individual price alert display
    AlertForm.tsx            # Create/edit alert form
```

## Complete Pipeline Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────────┐
│ BullMQ Repeater │────>│ Price Fetch Job   │────>│ Update          │────>│ Check Price  │
│ (every 15 min)  │     │ (Sneaks-API)      │     │ VendorPrice DB  │     │ Alerts       │
└─────────────────┘     └──────────────────┘     └─────────────────┘     └──────┬───────┘
                                                                                 │
                                                                          (alert triggered)
                                                                                 │
                                                                                 v
                                                                        ┌──────────────┐
                                                                        │ Send Push    │
                                                                        │ Notification │
                                                                        └──────────────┘
```

## BullMQ Setup

### Queue Definitions (`backend/src/jobs/queues.ts`)
```typescript
import { Queue } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const priceFetchQueue = new Queue('price-fetch', { connection });
export const priceAlertQueue = new Queue('price-alert', { connection });
export const pushNotificationQueue = new Queue('push-notification', { connection });

// Schedule repeatable price fetch job (every 15 minutes)
export async function setupRepeatableJobs() {
  await priceFetchQueue.add(
    'fetch-all-prices',
    {},
    {
      repeat: { every: 15 * 60 * 1000 }, // 15 minutes
      removeOnComplete: 100,
      removeOnFail: 50,
    }
  );
}
```

### Worker Registration (`backend/src/jobs/workers.ts`)
```typescript
import { Worker } from 'bullmq';
import { processPriceFetch } from './processors/priceFetch';
import { processPriceAlert } from './processors/priceAlert';
import { processPushNotification } from './processors/pushNotification';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export function startWorkers() {
  const priceFetchWorker = new Worker('price-fetch', processPriceFetch, {
    connection,
    concurrency: 5,
  });

  const priceAlertWorker = new Worker('price-alert', processPriceAlert, {
    connection,
    concurrency: 10,
  });

  const pushWorker = new Worker('push-notification', processPushNotification, {
    connection,
    concurrency: 20,
  });

  // Error handling
  [priceFetchWorker, priceAlertWorker, pushWorker].forEach((worker) => {
    worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} in ${worker.name} failed:`, err.message);
    });
  });

  console.log('Workers started: price-fetch, price-alert, push-notification');
}
```

### Job Processor Pattern
```typescript
import { Job } from 'bullmq';

export async function processPriceFetch(job: Job) {
  // 1. Fetch products that need price updates
  const products = await prisma.product.findMany({
    select: { id: true, name: true, sku: true },
    where: {
      vendorPrices: {
        some: {
          lastFetchedAt: { lt: new Date(Date.now() - 15 * 60 * 1000) },
        },
      },
    },
    take: 50, // Process in batches
  });

  // 2. Fetch prices from external API
  for (const product of products) {
    try {
      const prices = await fetchPricesFromSneaks(product.sku || product.name);

      // 3. Update VendorPrice records
      for (const price of prices) {
        await prisma.vendorPrice.upsert({
          where: { productId_vendorId: { productId: product.id, vendorId: price.vendorId } },
          update: { price: price.amount, inStock: price.inStock, lastFetchedAt: new Date() },
          create: { productId: product.id, vendorId: price.vendorId, price: price.amount, url: price.url, inStock: price.inStock },
        });
      }

      // 4. Queue alert checking for this product
      await priceAlertQueue.add('check-alerts', { productId: product.id });
    } catch (err) {
      console.error(`Failed to fetch prices for product ${product.id}:`, err);
      // Don't throw — continue processing other products
    }
  }
}
```

## Sneaks-API Integration

### Wrapper (`backend/src/services/sneaksApi.ts`)
```typescript
// Wrapper around Sneaks-API for price fetching
interface SneaksPrice {
  vendorId: string;
  amount: number;
  url: string;
  inStock: boolean;
}

export async function fetchPricesFromSneaks(query: string): Promise<SneaksPrice[]> {
  // Rate limit: max 10 requests per minute
  // Retry with exponential backoff on failure
  // Map vendor names to our vendorId slugs
}
```

## Expo Notifications — Mobile Setup

### Permission Flow + Token Registration (`mobile/src/services/notifications.ts`)
```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';

// Configure notification handler (how notifications appear when app is in foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permission and get push token
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  // Get Expo push token
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-expo-project-id', // from app.json
  });

  // Register token with backend
  await api.post('/notifications/register-token', {
    token: tokenData.data,
    platform: Platform.OS,
  });

  // Android notification channel
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('price-alerts', {
      name: 'Price Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return tokenData.data;
}

// Listen for notification taps (deep linking)
export function addNotificationResponseListener(
  handler: (productId: number) => void
) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    if (data?.productId) {
      handler(data.productId as number);
    }
  });
}
```

## Alert API Endpoints

### Route Pattern (`backend/src/routes/alerts.ts`)
```typescript
// GET /api/alerts — list user's alerts
// POST /api/alerts — create alert (with tier-based limits)
// DELETE /api/alerts/:id — remove alert

// Tier-based limits
const ALERT_LIMITS = {
  free: 3,
  pro: Infinity, // unlimited
};

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { productId, targetPrice } = req.body;

    // Check tier limit
    const alertCount = await prisma.priceAlert.count({
      where: { userId: req.user.id, isTriggered: false },
    });

    const limit = ALERT_LIMITS[req.user.subscriptionTier];
    if (alertCount >= limit) {
      throw new AppError(403, `Free users can set up to ${ALERT_LIMITS.free} alerts. Upgrade to Pro for unlimited.`);
    }

    const alert = await prisma.priceAlert.create({
      data: { userId: req.user.id, productId, targetPrice },
    });

    res.status(201).json({ alert });
  } catch (err) {
    next(err);
  }
});
```

## Push Payload Format

```typescript
// Expo Push Notification payload
const message = {
  to: userPushToken,
  title: 'Price Drop Alert',
  body: `${product.name} dropped to $${currentPrice}! (Target: $${alert.targetPrice})`,
  data: {
    type: 'price_alert',
    productId: product.id,
    alertId: alert.id,
  },
  sound: 'default',
  badge: 1,
  channelId: 'price-alerts', // Android
};
```

The `data.productId` field enables deep linking — the mobile app navigates to `ProductDetail` screen when the notification is tapped:
```typescript
navigation.navigate('ProductDetail', { productId: data.productId });
```

## Error Handling

### Retry with Exponential Backoff
```typescript
// BullMQ job options for retries
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000, // 5s, 25s, 125s
  },
}
```

### Dead Letter Queue
Failed jobs after all retries are moved to a dead letter queue for manual inspection:
```typescript
const priceFetchWorker = new Worker('price-fetch', processPriceFetch, {
  connection,
  concurrency: 5,
  settings: {
    backoffStrategy: (attemptsMade) => Math.pow(2, attemptsMade) * 5000,
  },
});
```

### Rate Limiting External APIs
```typescript
// Simple token bucket for Sneaks-API
let lastRequestTime = 0;
const MIN_INTERVAL = 6000; // 10 requests per minute = 1 per 6 seconds

async function rateLimitedFetch(url: string) {
  const now = Date.now();
  const waitTime = Math.max(0, MIN_INTERVAL - (now - lastRequestTime));
  if (waitTime > 0) await new Promise((r) => setTimeout(r, waitTime));
  lastRequestTime = Date.now();
  return fetch(url);
}
```

## Environment Variables

```
REDIS_HOST=localhost
REDIS_PORT=6379
EXPO_ACCESS_TOKEN=...              # For sending push notifications
SNEAKS_API_URL=...                 # External price API
FIREBASE_SERVICE_ACCOUNT_KEY=...   # For FCM (Android fallback)
```

## Coordination Rules

- **Backend API agent**: Alert routes follow the same Express patterns (Router, Zod, try/catch, AppError).
- **Database agent**: PriceAlert model changes need schema migration. May need to add `pushToken` field to User.
- **Mobile UI agent**: AlertsScreen is currently a placeholder — coordinate on the UI for alert creation/management.
- **Payments agent**: Tier-based alert limits depend on `user.subscriptionTier`. Trigger notifications on payment events.
