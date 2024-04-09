/*
  Warnings:

  - You are about to drop the column `payment_status` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `payment_status`,
    ADD COLUMN `amountPaidInCents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `discountInCents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `stripeFeeInCents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `totalPriceInCents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `travelFeeInCents` INTEGER UNSIGNED NOT NULL DEFAULT 0;
