import cron from "node-cron";
import { prisma } from "../lib/prisma";
import { getAdapter } from "./adapters";
import { processProducts } from "./processor";

/**
 * Check if a feed source is due for a sync based on its syncInterval and lastSyncAt.
 */
function isDue(lastSyncAt: Date | null, syncIntervalMinutes: number): boolean {
  if (!lastSyncAt) return true;
  const now = Date.now();
  const lastSync = lastSyncAt.getTime();
  const intervalMs = syncIntervalMinutes * 60 * 1000;
  return now - lastSync >= intervalMs;
}

/**
 * Run a single feed source: fetch from adapter, process products, update sync state.
 */
async function syncSource(sourceId: string, adapterType: string, config: Record<string, unknown>) {
  const adapter = getAdapter(adapterType);
  if (!adapter) {
    console.error(`[FeedSync] No adapter found for type: ${adapterType}`);
    await prisma.feedSource.update({
      where: { id: sourceId },
      data: {
        lastSyncStatus: "error",
        lastSyncError: `No adapter registered for type: ${adapterType}`,
      },
    });
    return;
  }

  console.log(`[FeedSync] Starting sync for source: ${sourceId} (${adapterType})`);

  try {
    const feedResult = await adapter.fetch(config);

    if (feedResult.errors.length > 0) {
      console.warn(`[FeedSync] ${feedResult.errors.length} fetch error(s) for ${sourceId}:`, feedResult.errors.slice(0, 3));
    }

    console.log(`[FeedSync] Fetched ${feedResult.totalFetched} products from ${sourceId}`);

    const processResult = await processProducts(feedResult.products);

    console.log(
      `[FeedSync] Processed ${sourceId}: ` +
      `${processResult.newProducts} new, ` +
      `${processResult.updatedProducts} updated, ` +
      `${processResult.vendorPricesUpserted} vendor prices, ` +
      `${processResult.restockedProducts} restocked`
    );

    if (processResult.errors.length > 0) {
      console.warn(`[FeedSync] ${processResult.errors.length} processing error(s):`, processResult.errors.slice(0, 3));
    }

    await prisma.feedSource.update({
      where: { id: sourceId },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: "success",
        lastSyncError: null,
      },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[FeedSync] Failed to sync ${sourceId}:`, errorMsg);

    await prisma.feedSource.update({
      where: { id: sourceId },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: "error",
        lastSyncError: errorMsg,
      },
    });
  }
}

/**
 * Start the feed sync cron job. Runs every 5 minutes and checks which sources are due.
 */
export function startFeedSyncJob() {
  cron.schedule("*/5 * * * *", async () => {
    console.log("[FeedSync] Checking sources...");

    try {
      const activeSources = await prisma.feedSource.findMany({
        where: { isActive: true },
      });

      if (activeSources.length === 0) {
        console.log("[FeedSync] No active feed sources.");
        return;
      }

      for (const source of activeSources) {
        if (isDue(source.lastSyncAt, source.syncInterval)) {
          await syncSource(
            source.id,
            source.adapterType,
            source.config as Record<string, unknown>
          );
        }
      }
    } catch (err) {
      console.error("[FeedSync] Scheduler error:", err);
    }
  });

  console.log("[FeedSync] Job scheduled — checks every 5 minutes for due sources.");
}
