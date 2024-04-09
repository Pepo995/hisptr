/*
  Warnings:

  - Made the column `date` on table `stripe_payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `stripe_payments` MODIFY `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);
