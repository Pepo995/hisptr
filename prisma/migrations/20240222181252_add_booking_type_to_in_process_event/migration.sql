-- AlterTable
ALTER TABLE `in_process_events` ADD COLUMN `booking_type` ENUM('contactUs', 'manuaInvoice', 'bookingFlow') NOT NULL DEFAULT 'bookingFlow',
    MODIFY `city` VARCHAR(255) NULL,
    MODIFY `stateId` INTEGER UNSIGNED NULL,
    MODIFY `typeId` INTEGER UNSIGNED NULL;
