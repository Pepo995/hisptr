/*
  Warnings:

  - Made the column `expiresAt` on table `PromotionalCode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `PromotionalCode` MODIFY `expiresAt` TIMESTAMP(0) NOT NULL;
