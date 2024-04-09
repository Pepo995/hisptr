/*
  Warnings:

  - You are about to drop the column `amountPaidInCents` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `discountInCents` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `paymentPlan` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `stripeFeeInCents` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `totalPriceInCents` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `travelFeeInCents` on the `in_process_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `in_process_events` DROP COLUMN `amountPaidInCents`,
    DROP COLUMN `discountInCents`,
    DROP COLUMN `paymentPlan`,
    DROP COLUMN `stripeFeeInCents`,
    DROP COLUMN `totalPriceInCents`,
    DROP COLUMN `travelFeeInCents`;
