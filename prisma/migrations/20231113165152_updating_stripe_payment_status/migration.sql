/*
  Warnings:

  - The values [Incomplete,Complete] on the enum `stripe_payments_paymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `stripe_payments` MODIFY `paymentStatus` ENUM('canceled', 'processing', 'requires_action', 'requires_capture', 'requires_confirmation', 'requires_payment_method', 'succeeded') NOT NULL;
