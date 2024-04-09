-- CreateTable
CREATE TABLE `in_process_events` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `eventDate` DATETIME(3) NOT NULL,
    `type_id` BIGINT UNSIGNED NULL,
    `city` VARCHAR(255) NOT NULL,
    `state_id` BIGINT UNSIGNED NULL,
    `email` VARCHAR(255) NOT NULL,
    `phoneNumber` VARCHAR(255) NOT NULL,
    `approximateBudget` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `message` VARCHAR(255) NOT NULL,
    `receiveCommunicationsAccepted` BOOLEAN NOT NULL DEFAULT false,
    `package_id` BIGINT UNSIGNED NOT NULL,
    `payment_plan` ENUM('full', 'partial_50_50') NOT NULL DEFAULT 'full',
    `amount_paid_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `total_price_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `discount_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `stripe_fee_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `travel_fee_in_cents` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    INDEX `in_process_events_package_id_foreign`(`package_id`),
    INDEX `in_process_events_state_id_foreign`(`state_id`),
    INDEX `in_process_events_type_id_foreign`(`type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `in_process_events` ADD CONSTRAINT `in_process_events_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `in_process_events` ADD CONSTRAINT `in_process_events_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
