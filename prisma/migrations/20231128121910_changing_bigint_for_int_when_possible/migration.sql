/*
  Warnings:

  - You are about to alter the column `market_id` on the `availability_requests` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `event_type` on the `availability_requests` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `state_id` on the `availability_requests` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `package_id` on the `availability_requests` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `filter_type` on the `event_photos_details` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `orientation_type` on the `event_photos_details` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `design_type` on the `event_photos_details` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `backdrop_type` on the `event_photos_details` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - The primary key for the `event_preferences` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `event_preferences` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `state_id` on the `event_venue_details` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `state_id` on the `events` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `market` on the `events` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `package_id` on the `events` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `type_id` on the `events` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `category_id` on the `events` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `reach_via` on the `events` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `packageId` on the `in_process_events` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `stateId` on the `in_process_events` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - You are about to alter the column `typeId` on the `in_process_events` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - The primary key for the `packages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `packages` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.
  - The primary key for the `states` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `states` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.

*/
-- DropForeignKey
ALTER TABLE `availability_requests` DROP FOREIGN KEY `availability_requests_event_type_foreign`;

-- DropForeignKey
ALTER TABLE `availability_requests` DROP FOREIGN KEY `availability_requests_market_id_foreign`;

-- DropForeignKey
ALTER TABLE `availability_requests` DROP FOREIGN KEY `availability_requests_package_id_foreign`;

-- DropForeignKey
ALTER TABLE `availability_requests` DROP FOREIGN KEY `availability_requests_state_id_foreign`;

-- DropForeignKey
ALTER TABLE `event_photos_details` DROP FOREIGN KEY `event_photos_details_backdrop_type_foreign`;

-- DropForeignKey
ALTER TABLE `event_photos_details` DROP FOREIGN KEY `event_photos_details_design_type_foreign`;

-- DropForeignKey
ALTER TABLE `event_photos_details` DROP FOREIGN KEY `event_photos_details_filter_type_foreign`;

-- DropForeignKey
ALTER TABLE `event_photos_details` DROP FOREIGN KEY `event_photos_details_orientation_type_foreign`;

-- DropForeignKey
ALTER TABLE `event_venue_details` DROP FOREIGN KEY `event_venue_details_state_id_foreign`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_category_id_foreign`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_market_foreign`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_package_id_foreign`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_reach_via_foreign`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_state_id_foreign`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_type_id_foreign`;

-- DropForeignKey
ALTER TABLE `in_process_events` DROP FOREIGN KEY `in_process_events_package_id_foreign`;

-- DropForeignKey
ALTER TABLE `in_process_events` DROP FOREIGN KEY `in_process_events_state_id_foreign`;

-- AlterTable
ALTER TABLE `availability_requests` MODIFY `market_id` INTEGER UNSIGNED NOT NULL,
    MODIFY `event_type` INTEGER UNSIGNED NOT NULL,
    MODIFY `state_id` INTEGER UNSIGNED NOT NULL,
    MODIFY `package_id` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `event_photos_details` MODIFY `filter_type` INTEGER UNSIGNED NOT NULL,
    MODIFY `orientation_type` INTEGER UNSIGNED NOT NULL,
    MODIFY `design_type` INTEGER UNSIGNED NOT NULL,
    MODIFY `backdrop_type` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `event_preferences` DROP PRIMARY KEY,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `event_venue_details` MODIFY `state_id` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `events` MODIFY `state_id` INTEGER UNSIGNED NULL,
    MODIFY `market` INTEGER UNSIGNED NULL,
    MODIFY `package_id` INTEGER UNSIGNED NOT NULL,
    MODIFY `type_id` INTEGER UNSIGNED NULL,
    MODIFY `category_id` INTEGER UNSIGNED NULL,
    MODIFY `reach_via` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `in_process_events` MODIFY `packageId` INTEGER UNSIGNED NULL,
    MODIFY `stateId` INTEGER UNSIGNED NOT NULL,
    MODIFY `typeId` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `packages` DROP PRIMARY KEY,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `states` DROP PRIMARY KEY,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `availability_requests` ADD CONSTRAINT `availability_requests_event_type_foreign` FOREIGN KEY (`event_type`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `availability_requests` ADD CONSTRAINT `availability_requests_market_id_foreign` FOREIGN KEY (`market_id`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `availability_requests` ADD CONSTRAINT `availability_requests_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `availability_requests` ADD CONSTRAINT `availability_requests_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_photos_details` ADD CONSTRAINT `event_photos_details_backdrop_type_foreign` FOREIGN KEY (`backdrop_type`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_photos_details` ADD CONSTRAINT `event_photos_details_design_type_foreign` FOREIGN KEY (`design_type`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_photos_details` ADD CONSTRAINT `event_photos_details_filter_type_foreign` FOREIGN KEY (`filter_type`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_photos_details` ADD CONSTRAINT `event_photos_details_orientation_type_foreign` FOREIGN KEY (`orientation_type`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_venue_details` ADD CONSTRAINT `event_venue_details_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_market_foreign` FOREIGN KEY (`market`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_reach_via_foreign` FOREIGN KEY (`reach_via`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `in_process_events` ADD CONSTRAINT `in_process_events_package_id_foreign` FOREIGN KEY (`packageId`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `in_process_events` ADD CONSTRAINT `in_process_events_state_id_foreign` FOREIGN KEY (`stateId`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
