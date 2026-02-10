-- AlterTable
ALTER TABLE "price_alerts" ADD COLUMN     "triggered_at" TIMESTAMP(3),
ADD COLUMN     "triggered_price" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "push_token" TEXT;
