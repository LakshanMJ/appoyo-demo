/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Shift` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_organizationId_fkey";

-- DropIndex
DROP INDEX "Shift_organizationId_category_idx";

-- DropIndex
DROP INDEX "Shift_organizationId_startTime_endTime_idx";

-- DropIndex
DROP INDEX "Shift_organizationId_status_idx";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "organizationId";

-- CreateIndex
CREATE INDEX "Shift_startTime_endTime_idx" ON "Shift"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "Shift_status_idx" ON "Shift"("status");

-- CreateIndex
CREATE INDEX "Shift_category_idx" ON "Shift"("category");
