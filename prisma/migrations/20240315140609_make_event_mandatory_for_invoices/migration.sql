/*
  Warnings:

  - Made the column `eventId` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_eventId_fkey`;

-- AlterTable
ALTER TABLE `Invoice` MODIFY `eventId` BIGINT UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
