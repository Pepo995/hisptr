/*
  Warnings:

  - Made the column `created_at` on table `stripe_webhook_events_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `stripe_webhook_events_logs` MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);
