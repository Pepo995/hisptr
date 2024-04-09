-- AlterTable
ALTER TABLE `events` ADD COLUMN `payment_plan` ENUM('full', 'partial_50_50') NOT NULL DEFAULT 'full';
