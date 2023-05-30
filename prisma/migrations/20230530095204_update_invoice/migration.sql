-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "changedSum" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "changedSumDates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];
