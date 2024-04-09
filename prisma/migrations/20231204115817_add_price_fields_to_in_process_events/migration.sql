-- AlterTable
ALTER TABLE `in_process_events` ADD COLUMN `amount_paid_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `discount_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `payment_plan` ENUM('full', 'partial_50_50') NOT NULL DEFAULT 'full',
    ADD COLUMN `stripe_fee_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `total_price_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `travel_fee_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0;
