import { prisma } from "../lib/prisma";
import { NormalizedProduct } from "./types";
import { Decimal } from "@prisma/client/runtime/library";
import { checkDropAlerts } from "../services/dropAlertChecker";

export interface ProcessResult {
  newProducts: number;
  updatedProducts: number;
  vendorPricesUpserted: number;
  restockedProducts: number;
  errors: string[];
}

/**
 * Match an incoming normalized product to an existing DB product.
 * Priority: 1) sourceId+sourceName  2) styleId/sku  3) null (new product)
 */
async function findExistingProduct(product: NormalizedProduct) {
  // 1. Match by sourceId + sourceName (same source, same product)
  if (product.sourceId && product.sourceName) {
    const bySource = await prisma.product.findFirst({
      where: {
        sourceId: product.sourceId,
        sourceName: product.sourceName,
      },
    });
    if (bySource) return bySource;
  }

  // 2. Match by styleId / SKU (cross-source dedup)
  if (product.sku || product.styleId) {
    const styleIdValue = product.styleId || product.sku;
    const bySku = await prisma.product.findFirst({
      where: {
        OR: [
          { styleId: styleIdValue },
          { sku: styleIdValue },
        ],
      },
    });
    if (bySku) return bySku;
  }

  return null;
}

/**
 * Recalculate the currentLowestPrice for a product based on in-stock vendor prices.
 */
async function recalcLowestPrice(productId: number): Promise<void> {
  const vendorPrices = await prisma.vendorPrice.findMany({
    where: {
      productId,
      inStock: true,
      price: { not: null },
    },
    select: { price: true },
    orderBy: { price: "asc" },
    take: 1,
  });

  const lowestPrice = vendorPrices.length > 0 ? vendorPrices[0].price : null;

  await prisma.product.update({
    where: { id: productId },
    data: { currentLowestPrice: lowestPrice },
  });
}

/**
 * Process a batch of normalized products: dedup, upsert, recalc prices, detect new/restocked.
 */
export async function processProducts(
  products: NormalizedProduct[]
): Promise<ProcessResult> {
  const result: ProcessResult = {
    newProducts: 0,
    updatedProducts: 0,
    vendorPricesUpserted: 0,
    restockedProducts: 0,
    errors: [],
  };

  const newProductIds: number[] = [];
  const restockedProductIds: number[] = [];

  for (const normalized of products) {
    try {
      const existing = await findExistingProduct(normalized);

      let productId: number;

      if (existing) {
        // Update existing product
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            name: normalized.name,
            brand: normalized.brand,
            category: normalized.category,
            sku: normalized.sku || existing.sku,
            styleId: normalized.styleId || existing.styleId,
            sourceId: normalized.sourceId,
            sourceName: normalized.sourceName,
            slug: normalized.slug || existing.slug,
            colorway: normalized.colorway || existing.colorway,
            gender: normalized.gender || existing.gender,
            retailPrice: normalized.retailPrice,
            releaseDate: normalized.releaseDate || existing.releaseDate,
            description: normalized.description || existing.description,
            images: normalized.images.length > 0 ? normalized.images : existing.images,
            lastSyncAt: new Date(),
          },
        });
        productId = existing.id;
        result.updatedProducts++;
      } else {
        // Create new product
        const created = await prisma.product.create({
          data: {
            name: normalized.name,
            brand: normalized.brand,
            category: normalized.category,
            sku: normalized.sku,
            styleId: normalized.styleId,
            sourceId: normalized.sourceId,
            sourceName: normalized.sourceName,
            slug: normalized.slug,
            colorway: normalized.colorway,
            gender: normalized.gender,
            retailPrice: normalized.retailPrice,
            releaseDate: normalized.releaseDate,
            description: normalized.description,
            images: normalized.images,
            lastSyncAt: new Date(),
          },
        });
        productId = created.id;
        newProductIds.push(productId);
        result.newProducts++;
      }

      // Upsert vendor prices
      for (const vp of normalized.vendorPrices) {
        // Check if vendor exists
        const vendor = await prisma.vendor.findUnique({
          where: { id: vp.vendorId },
        });
        if (!vendor) {
          result.errors.push(`Vendor ${vp.vendorId} not found, skipping price for product ${normalized.name}`);
          continue;
        }

        // Check for restock (was out of stock, now in stock)
        const existingVP = await prisma.vendorPrice.findUnique({
          where: {
            productId_vendorId: { productId, vendorId: vp.vendorId },
          },
        });

        const wasOutOfStock = existingVP && !existingVP.inStock;
        const nowInStock = vp.inStock;
        const isRestock = wasOutOfStock && nowInStock;

        const stockChangedAt =
          existingVP && existingVP.inStock !== vp.inStock
            ? new Date()
            : existingVP?.stockChangedAt || undefined;

        await prisma.vendorPrice.upsert({
          where: {
            productId_vendorId: { productId, vendorId: vp.vendorId },
          },
          update: {
            price: vp.price,
            url: vp.url,
            inStock: vp.inStock,
            isAffiliateUrl: vp.isAffiliateUrl,
            lastFetchedAt: new Date(),
            stockChangedAt,
          },
          create: {
            productId,
            vendorId: vp.vendorId,
            price: vp.price,
            url: vp.url,
            inStock: vp.inStock,
            isAffiliateUrl: vp.isAffiliateUrl,
            stockChangedAt: vp.inStock ? undefined : new Date(),
          },
        });

        result.vendorPricesUpserted++;
        if (isRestock) {
          if (!restockedProductIds.includes(productId)) {
            restockedProductIds.push(productId);
          }
          result.restockedProducts++;
        }
      }

      // Recalculate lowest price
      await recalcLowestPrice(productId);
    } catch (err) {
      result.errors.push(`Failed to process product "${normalized.name}": ${err}`);
    }
  }

  // Check drop/restock alerts for matching products
  try {
    await checkDropAlerts(newProductIds, restockedProductIds);
  } catch (err) {
    result.errors.push(`Drop alert check failed: ${err}`);
  }

  return result;
}
