/*
  Warnings:

  - You are about to drop the `stripe_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `stripe_logs`;

-- CreateTable
CREATE TABLE `stripe_webhook_events_logs` (
    `eventId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`eventId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
