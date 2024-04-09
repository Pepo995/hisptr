/*
  Warnings:

  - You are about to drop the `stripe_payment_methods` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `stripe_payment_methods` DROP FOREIGN KEY `stripe_payment_methods_stripeCustomerEmail_fkey`;

-- DropTable
DROP TABLE `stripe_payment_methods`;

-- CreateTable
CREATE TABLE `stripe_setup_intents` (
    `stripeCustomerEmail` VARCHAR(191) NOT NULL,
    `setupIntentId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `stripe_setup_intents_setupIntentId_key`(`setupIntentId`),
    PRIMARY KEY (`stripeCustomerEmail`, `setupIntentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stripe_setup_intents` ADD CONSTRAINT `stripe_setup_intents_stripeCustomerEmail_fkey` FOREIGN KEY (`stripeCustomerEmail`) REFERENCES `stripe_customers`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
