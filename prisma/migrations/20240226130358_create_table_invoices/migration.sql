/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `stripe_payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `invoiceType` ENUM('deposit', 'final_balance', 'add_on') NOT NULL,
    `inProcessEventId` VARCHAR(191) NULL,
    `eventId` BIGINT UNSIGNED NULL,
    `paymentId` VARCHAR(191) NULL,
    `subtotalInCents` INTEGER UNSIGNED NOT NULL,
    `paidBeforeInCents` INTEGER UNSIGNED NULL,
    `pendingInCents` INTEGER UNSIGNED NULL,
    `pendingDueDate` TIMESTAMP(0) NULL,

    UNIQUE INDEX `Invoice_paymentId_key`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `stripe_payments_paymentId_key` ON `stripe_payments`(`paymentId`);

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_inProcessEventId_fkey` FOREIGN KEY (`inProcessEventId`) REFERENCES `in_process_events`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `stripe_payments`(`paymentId`) ON DELETE SET NULL ON UPDATE CASCADE;
