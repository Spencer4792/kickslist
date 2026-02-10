import "dotenv/config";
import { KicksDBAdapter } from "../src/feeds/adapters/kicksdb";
import { processProducts, ProcessResult } from "../src/feeds/processor";
import { prisma } from "../src/lib/prisma";

async function syncFeed(endpoint: string, sourceName: string, label: string): Promise<ProcessResult> {
  const adapter = new KicksDBAdapter();
  console.log(`\nFetching ${label}...`);

  const result = await adapter.fetch({
    endpoint,
    sourceName,
    limit: 100,
    maxPages: 10,
  });

  console.log(`  Fetched: ${result.totalFetched} products`);
  if (result.errors.length > 0) {
    console.log(`  Fetch errors: ${result.errors.length}`);
    result.errors.slice(0, 3).forEach((e) => console.log(`    ${e}`));
  }

  console.log("  Processing into database...");
  const processResult = await processProducts(result.products);
  console.log(`  New:       ${processResult.newProducts}`);
  console.log(`  Updated:   ${processResult.updatedProducts}`);
  console.log(`  Prices:    ${processResult.vendorPricesUpserted}`);
  console.log(`  Restocked: ${processResult.restockedProducts}`);
  if (processResult.errors.length > 0) {
    console.log(`  Errors:    ${processResult.errors.length}`);
  }

  return processResult;
}

async function main() {
  console.log("=== Full Catalog Sync ===");

  const r1 = await syncFeed("/v3/stockx/products", "kicksdb-stockx", "StockX catalog (up to 1000)");
  const r2 = await syncFeed("/v3/goat/products", "kicksdb-goat", "GOAT catalog (up to 1000)");

  console.log("\n=== Summary ===");
  console.log(`Total new products:     ${r1.newProducts + r2.newProducts}`);
  console.log(`Total updated (deduped): ${r1.updatedProducts + r2.updatedProducts}`);
  console.log(`Total vendor prices:    ${r1.vendorPricesUpserted + r2.vendorPricesUpserted}`);

  const totalProducts = await prisma.product.count();
  const totalVP = await prisma.vendorPrice.count();
  console.log(`\nDatabase totals:`);
  console.log(`  Products:      ${totalProducts}`);
  console.log(`  Vendor Prices: ${totalVP}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
