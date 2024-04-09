/*
  Warnings:

  - Made the column `packageQty` on table `in_process_events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `packageRetailPriceInCents` on table `in_process_events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `in_process_events` MODIFY `packageQty` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    MODIFY `packageRetailPriceInCents` INTEGER UNSIGNED NOT NULL DEFAULT 0;
