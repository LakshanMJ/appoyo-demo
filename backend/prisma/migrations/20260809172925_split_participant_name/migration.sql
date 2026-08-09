/*
  Warnings:

  - You are about to drop the column `address` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Participant_name_idx";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "address",
DROP COLUMN "name",
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Participant_firstName_idx" ON "Participant"("firstName");

-- CreateIndex
CREATE INDEX "Participant_lastName_idx" ON "Participant"("lastName");
