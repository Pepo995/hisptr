-- AlterTable
ALTER TABLE `in_process_events` ADD COLUMN `packageQty` INTEGER UNSIGNED NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `EventPackages` (
    `eventId` BIGINT UNSIGNED NOT NULL,
    `packageId` INTEGER UNSIGNED NOT NULL,
    `packageDescription` VARCHAR(255) NOT NULL,
    `packageRetailPriceInCents` INTEGER UNSIGNED NOT NULL,
    `packageQty` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`eventId`, `packageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventPackages` ADD CONSTRAINT `EventPackages_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
