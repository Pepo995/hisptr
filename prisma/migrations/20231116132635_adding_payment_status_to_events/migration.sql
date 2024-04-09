/*
  Warnings:

  - Added the required column `payment_status` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `events` ADD COLUMN `payment_status` ENUM('completed', 'holded', 'one_of_two') NOT NULL;
