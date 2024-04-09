-- AlterTable
ALTER TABLE `events` ADD COLUMN `promotionalCodeCode` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `PromotionalCode` (
    `code` VARCHAR(255) NOT NULL,
    `discount` INTEGER UNSIGNED NOT NULL,
    `isPercentage` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `events_promotional_code_code_foreign` ON `events`(`promotionalCodeCode`);

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_promotional_code_code_foreign` FOREIGN KEY (`promotionalCodeCode`) REFERENCES `PromotionalCode`(`code`) ON DELETE CASCADE ON UPDATE NO ACTION;
