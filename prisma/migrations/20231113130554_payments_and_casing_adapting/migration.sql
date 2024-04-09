/*
  Warnings:

  - You are about to drop the `StripeCustomer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `StripeCustomer`;

-- CreateTable
CREATE TABLE `stripe_customer` (
    `email` VARCHAR(191) NOT NULL,
    `stripeCustomerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `stripe_customer_stripeCustomerId_key`(`stripeCustomerId`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stripe_payment_method` (
    `stripeCustomerEmail` VARCHAR(191) NOT NULL,
    `setupIntentId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `stripe_payment_method_setupIntentId_key`(`setupIntentId`),
    PRIMARY KEY (`stripeCustomerEmail`, `setupIntentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stripe_payment` (
    `stripeCustomerEmail` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `paymentStatus` ENUM('Incomplete', 'Complete') NOT NULL,

    PRIMARY KEY (`stripeCustomerEmail`, `paymentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stripe_payment_method` ADD CONSTRAINT `stripe_payment_method_stripeCustomerEmail_fkey` FOREIGN KEY (`stripeCustomerEmail`) REFERENCES `stripe_customer`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stripe_payment` ADD CONSTRAINT `stripe_payment_stripeCustomerEmail_fkey` FOREIGN KEY (`stripeCustomerEmail`) REFERENCES `stripe_customer`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
