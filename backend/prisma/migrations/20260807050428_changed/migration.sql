/*
  Warnings:

  - The values [ASSISTANCE,NURSING,TRAVEL_TRANSPORT,MEAL_PREP,DOMESTIC] on the enum `ShiftType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ShiftType_new" AS ENUM ('assistance', 'transport', 'domestic', 'community', 'nursing');
ALTER TABLE "public"."Shift" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Shift" ALTER COLUMN "type" TYPE "ShiftType_new" USING ("type"::text::"ShiftType_new");
ALTER TYPE "ShiftType" RENAME TO "ShiftType_old";
ALTER TYPE "ShiftType_new" RENAME TO "ShiftType";
DROP TYPE "public"."ShiftType_old";
ALTER TABLE "Shift" ALTER COLUMN "type" SET DEFAULT 'assistance';
COMMIT;

-- AlterTable
ALTER TABLE "Shift" ALTER COLUMN "type" SET DEFAULT 'assistance';
