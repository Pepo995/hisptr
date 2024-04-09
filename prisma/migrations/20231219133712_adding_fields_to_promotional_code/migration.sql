-- AlterTable
ALTER TABLE `PromotionalCode` ADD COLUMN `expiresAt` TIMESTAMP(0) NULL,
    ADD COLUMN `isOneTime` BOOLEAN NOT NULL DEFAULT true;
