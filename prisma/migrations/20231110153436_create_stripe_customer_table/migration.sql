-- CreateTable
CREATE TABLE `StripeCustomer` (
    `email` VARCHAR(191) NOT NULL,
    `stripeCustomerId` VARCHAR(191) NOT NULL,
    `setupIntentId` VARCHAR(191) NULL,

    UNIQUE INDEX `StripeCustomer_stripeCustomerId_key`(`stripeCustomerId`),
    UNIQUE INDEX `StripeCustomer_setupIntentId_key`(`setupIntentId`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
