/*
  Warnings:

  - You are about to drop the column `amount_paid_in_cents` on the `in_process_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `in_process_events` DROP COLUMN `amount_paid_in_cents`;
