/*
  Warnings:

  - You are about to drop the column `amountPaidInCents` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `discountInCents` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `stripeFeeInCents` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `totalPriceInCents` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `travelFeeInCents` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `amountPaidInCents`,
    DROP COLUMN `discountInCents`,
    DROP COLUMN `stripeFeeInCents`,
    DROP COLUMN `totalPriceInCents`,
    DROP COLUMN `travelFeeInCents`,
    ADD COLUMN `amount_paid_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `discount_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `stripe_fee_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `total_price_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `travel_fee_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0;
