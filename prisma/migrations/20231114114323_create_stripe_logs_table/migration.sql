-- CreateTable
CREATE TABLE `stripe_logs` (
    `stripeId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`stripeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
