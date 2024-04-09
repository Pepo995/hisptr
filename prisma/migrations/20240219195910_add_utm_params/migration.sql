/*
  Warnings:

  - A unique constraint covering the columns `[inProcessEventId]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[utmParamsId]` on the table `in_process_events` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `PromotionalCode` ALTER COLUMN `expiresAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `events` ADD COLUMN `inProcessEventId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `in_process_events` ADD COLUMN `utmParamsId` INTEGER UNSIGNED NULL;

-- CreateTable
CREATE TABLE `UtmParams` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `utmSource` VARCHAR(255) NULL,
    `utmMedium` VARCHAR(255) NULL,
    `utmCampaign` VARCHAR(255) NULL,
    `utmTerm` VARCHAR(255) NULL,
    `utmContent` VARCHAR(255) NULL,
    `utmId` VARCHAR(255) NULL,
    `clientId` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `events_inProcessEventId_key` ON `events`(`inProcessEventId`);

-- CreateIndex
CREATE UNIQUE INDEX `in_process_events_utmParamsId_key` ON `in_process_events`(`utmParamsId`);

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_inProcessEventId_fkey` FOREIGN KEY (`inProcessEventId`) REFERENCES `in_process_events`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `in_process_events` ADD CONSTRAINT `in_process_events_utmParamsId_fkey` FOREIGN KEY (`utmParamsId`) REFERENCES `UtmParams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
