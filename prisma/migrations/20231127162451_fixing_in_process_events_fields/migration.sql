/*
  Warnings:

  - You are about to drop the column `amount_paid_in_cents` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `discount_in_cents` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `package_id` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `payment_plan` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_fee_in_cents` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `total_price_in_cents` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `travel_fee_in_cents` on the `in_process_events` table. All the data in the column will be lost.
  - You are about to drop the column `type_id` on the `in_process_events` table. All the data in the column will be lost.
  - Added the required column `stateId` to the `in_process_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `in_process_events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `in_process_events` DROP FOREIGN KEY `in_process_events_package_id_foreign`;

-- DropForeignKey
ALTER TABLE `in_process_events` DROP FOREIGN KEY `in_process_events_state_id_foreign`;

-- DropIndex
DROP INDEX `in_process_events_type_id_foreign` ON `in_process_events`;

-- AlterTable
ALTER TABLE `in_process_events` DROP COLUMN `amount_paid_in_cents`,
    DROP COLUMN `discount_in_cents`,
    DROP COLUMN `package_id`,
    DROP COLUMN `payment_plan`,
    DROP COLUMN `state_id`,
    DROP COLUMN `stripe_fee_in_cents`,
    DROP COLUMN `total_price_in_cents`,
    DROP COLUMN `travel_fee_in_cents`,
    DROP COLUMN `type_id`,
    ADD COLUMN `amountPaidInCents` INTEGER UNSIGNED NULL,
    ADD COLUMN `discountInCents` INTEGER UNSIGNED NULL,
    ADD COLUMN `packageId` BIGINT UNSIGNED NULL,
    ADD COLUMN `paymentPlan` ENUM('full', 'partial_50_50') NULL,
    ADD COLUMN `stateId` BIGINT UNSIGNED NOT NULL,
    ADD COLUMN `stripeFeeInCents` INTEGER UNSIGNED NULL,
    ADD COLUMN `totalPriceInCents` INTEGER UNSIGNED NULL,
    ADD COLUMN `travelFeeInCents` INTEGER UNSIGNED NULL,
    ADD COLUMN `typeId` BIGINT UNSIGNED NOT NULL,
    ALTER COLUMN `approximateBudget` DROP DEFAULT,
    ALTER COLUMN `receiveCommunicationsAccepted` DROP DEFAULT;

-- CreateIndex
CREATE INDEX `in_process_events_package_id_foreign` ON `in_process_events`(`packageId`);

-- CreateIndex
CREATE INDEX `in_process_events_state_id_foreign` ON `in_process_events`(`stateId`);

-- CreateIndex
CREATE INDEX `in_process_events_type_id_foreign` ON `in_process_events`(`typeId`);

-- AddForeignKey
ALTER TABLE `in_process_events` ADD CONSTRAINT `in_process_events_package_id_foreign` FOREIGN KEY (`packageId`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `in_process_events` ADD CONSTRAINT `in_process_events_state_id_foreign` FOREIGN KEY (`stateId`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
