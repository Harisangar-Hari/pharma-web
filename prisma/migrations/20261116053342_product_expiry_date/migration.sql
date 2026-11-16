/*
  Warnings:

  - You are about to drop the column `expiryInfo` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "expiryInfo",
ADD COLUMN     "batchNumber" TEXT,
ADD COLUMN     "expiryAlertDays" INTEGER NOT NULL DEFAULT 90,
ADD COLUMN     "expiryDate" TIMESTAMP(3);
