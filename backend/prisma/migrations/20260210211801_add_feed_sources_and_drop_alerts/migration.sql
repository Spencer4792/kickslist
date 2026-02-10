-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('drop', 'restock');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "colorway" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "last_sync_at" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "source_id" TEXT,
ADD COLUMN     "source_name" TEXT,
ADD COLUMN     "style_id" TEXT;

-- AlterTable
ALTER TABLE "vendor_prices" ADD COLUMN     "is_affiliate_url" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stock_changed_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "feed_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adapter_type" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB NOT NULL DEFAULT '{}',
    "last_sync_at" TIMESTAMP(3),
    "last_sync_status" TEXT,
    "last_sync_error" TEXT,
    "sync_interval" INTEGER NOT NULL DEFAULT 1440,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feed_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drop_alerts" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "alert_type" "AlertType" NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "keywords" TEXT,
    "min_price" DECIMAL(10,2),
    "max_price" DECIMAL(10,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "triggered_count" INTEGER NOT NULL DEFAULT 0,
    "last_triggered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drop_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_style_id_idx" ON "products"("style_id");

-- CreateIndex
CREATE INDEX "products_source_id_source_name_idx" ON "products"("source_id", "source_name");

-- AddForeignKey
ALTER TABLE "drop_alerts" ADD CONSTRAINT "drop_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
