/*
  Warnings:

  - A unique constraint covering the columns `[signUpToken]` on the table `events` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `events` ADD COLUMN `acceptedAt` DATETIME NULL,
    ADD COLUMN `signUpToken` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `events_signUpToken_key` ON `events`(`signUpToken`);
