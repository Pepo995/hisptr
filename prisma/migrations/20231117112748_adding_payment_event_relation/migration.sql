/*
  Warnings:

  - Added the required column `event_id` to the `stripe_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stripe_payments` ADD COLUMN `event_id` BIGINT UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `stripe_payments` ADD CONSTRAINT `stripe_payments_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
