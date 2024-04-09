/*
  Warnings:

  - You are about to drop the column `stripe_fee_in_cents` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `total_price_in_cents` on the `in_process_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `in_process_events` DROP COLUMN `stripe_fee_in_cents`,
    DROP COLUMN `total_price_in_cents`,
    ADD COLUMN `stripe_fee_for_full_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `stripe_fee_for_partial_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `total_price_for_full_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `total_price_for_partial_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0;
