/*
  Warnings:

  - You are about to drop the `stripe_customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_payment_method` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `stripe_payment` DROP FOREIGN KEY `stripe_payment_stripeCustomerEmail_fkey`;

-- DropForeignKey
ALTER TABLE `stripe_payment_method` DROP FOREIGN KEY `stripe_payment_method_stripeCustomerEmail_fkey`;

-- DropTable
DROP TABLE `stripe_customer`;

-- DropTable
DROP TABLE `stripe_payment`;

-- DropTable
DROP TABLE `stripe_payment_method`;

-- CreateTable
CREATE TABLE `stripe_customers` (
    `email` VARCHAR(191) NOT NULL,
    `stripeCustomerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `stripe_customers_stripeCustomerId_key`(`stripeCustomerId`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stripe_payment_methods` (
    `stripeCustomerEmail` VARCHAR(191) NOT NULL,
    `setupIntentId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `stripe_payment_methods_setupIntentId_key`(`setupIntentId`),
    PRIMARY KEY (`stripeCustomerEmail`, `setupIntentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stripe_payments` (
    `stripeCustomerEmail` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `paymentStatus` ENUM('Incomplete', 'Complete') NOT NULL,

    PRIMARY KEY (`stripeCustomerEmail`, `paymentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stripe_payment_methods` ADD CONSTRAINT `stripe_payment_methods_stripeCustomerEmail_fkey` FOREIGN KEY (`stripeCustomerEmail`) REFERENCES `stripe_customers`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stripe_payments` ADD CONSTRAINT `stripe_payments_stripeCustomerEmail_fkey` FOREIGN KEY (`stripeCustomerEmail`) REFERENCES `stripe_customers`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
