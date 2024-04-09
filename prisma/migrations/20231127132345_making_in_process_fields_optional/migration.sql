/*
  Warnings:

  - Made the column `type_id` on table `in_process_events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state_id` on table `in_process_events` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `in_process_events` DROP FOREIGN KEY `in_process_events_state_id_foreign`;

-- AlterTable
ALTER TABLE `in_process_events` MODIFY `type_id` BIGINT UNSIGNED NOT NULL,
    MODIFY `state_id` BIGINT UNSIGNED NOT NULL,
    MODIFY `email` VARCHAR(255) NULL,
    MODIFY `phoneNumber` VARCHAR(255) NULL,
    MODIFY `approximateBudget` INTEGER UNSIGNED NULL DEFAULT 0,
    MODIFY `message` VARCHAR(255) NULL,
    MODIFY `receiveCommunicationsAccepted` BOOLEAN NULL DEFAULT false,
    MODIFY `package_id` BIGINT UNSIGNED NULL,
    MODIFY `payment_plan` ENUM('full', 'partial_50_50') NULL DEFAULT 'full',
    MODIFY `amount_paid_in_cents` INTEGER UNSIGNED NULL DEFAULT 0,
    MODIFY `total_price_in_cents` INTEGER UNSIGNED NULL DEFAULT 0,
    MODIFY `discount_in_cents` INTEGER UNSIGNED NULL DEFAULT 0,
    MODIFY `stripe_fee_in_cents` INTEGER UNSIGNED NULL DEFAULT 0,
    MODIFY `travel_fee_in_cents` INTEGER UNSIGNED NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `in_process_events` ADD CONSTRAINT `in_process_events_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
