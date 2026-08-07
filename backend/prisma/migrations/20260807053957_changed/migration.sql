-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_participantId_fkey";

-- AlterTable
ALTER TABLE "Shift" ALTER COLUMN "participantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
