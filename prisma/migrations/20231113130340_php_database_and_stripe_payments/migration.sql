-- CreateTable
CREATE TABLE `availability_request_partners` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `availability_request_id` BIGINT UNSIGNED NOT NULL,
    `partner_id` BIGINT UNSIGNED NOT NULL,
    `status` ENUM('pending', 'available', 'unavailable') NULL DEFAULT 'pending',
    `is_assigned` BOOLEAN NULL DEFAULT false,
    `reason_type` ENUM('unavailable_staff', 'out_of_service_area', 'unavailable_equipment', 'other') NULL,
    `reason` VARCHAR(255) NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `availability_request_partners_availability_request_id_foreign`(`availability_request_id`),
    INDEX `availability_request_partners_partner_id_foreign`(`partner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability_requests` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `availability_number` VARCHAR(255) NULL,
    `market_id` BIGINT UNSIGNED NOT NULL,
    `event_type` BIGINT UNSIGNED NOT NULL,
    `event_date` DATE NOT NULL,
    `start_time` TIME(0) NOT NULL,
    `end_time` TIME(0) NOT NULL,
    `state_id` BIGINT UNSIGNED NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `package_id` BIGINT UNSIGNED NOT NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `availability_requests_event_type_foreign`(`event_type`),
    INDEX `availability_requests_market_id_foreign`(`market_id`),
    INDEX `availability_requests_package_id_foreign`(`package_id`),
    INDEX `availability_requests_state_id_foreign`(`state_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blogs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `auther_name` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `main_image` VARCHAR(255) NOT NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_room_messages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `chat_room_id` BIGINT UNSIGNED NOT NULL,
    `sender_id` BIGINT UNSIGNED NOT NULL,
    `receiver_id` BIGINT UNSIGNED NOT NULL,
    `sender_type` ENUM('superadmin', 'member', 'partner', 'partneruser', 'customer') NOT NULL,
    `receiver_type` ENUM('superadmin', 'member', 'partner', 'partneruser', 'customer') NOT NULL,
    `message` TEXT NOT NULL,
    `is_seen` BOOLEAN NOT NULL DEFAULT false,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `chat_room_messages_chat_room_id_foreign`(`chat_room_id`),
    INDEX `chat_room_messages_receiver_id_foreign`(`receiver_id`),
    INDEX `chat_room_messages_sender_id_foreign`(`sender_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_rooms` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `type` ENUM('admin_partner', 'admin_customer', 'partner_customer') NOT NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `chat_rooms_event_id_foreign`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `sortname` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `phonecode` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country_partners` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `country_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `country_partners_country_id_foreign`(`country_id`),
    INDEX `country_partners_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `event_id` BIGINT UNSIGNED NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('event', 'message') NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `customer_notifications_event_id_foreign`(`event_id`),
    INDEX `customer_notifications_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `errors` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NULL,
    `code` VARCHAR(255) NULL,
    `file` VARCHAR(255) NULL,
    `line` VARCHAR(255) NULL,
    `message` TEXT NULL,
    `trace` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_photos_details` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `filter_type` BIGINT UNSIGNED NOT NULL,
    `orientation_type` BIGINT UNSIGNED NOT NULL,
    `design_type` BIGINT UNSIGNED NOT NULL,
    `first_line` VARCHAR(255) NULL,
    `second_line` VARCHAR(255) NULL,
    `primary_color` VARCHAR(255) NULL,
    `secondary_color` VARCHAR(255) NULL,
    `vision` LONGTEXT NULL,
    `logo` VARCHAR(255) NULL,
    `backdrop_type` BIGINT UNSIGNED NOT NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `event_photos_details_backdrop_type_foreign`(`backdrop_type`),
    INDEX `event_photos_details_design_type_foreign`(`design_type`),
    INDEX `event_photos_details_event_id_foreign`(`event_id`),
    INDEX `event_photos_details_filter_type_foreign`(`filter_type`),
    INDEX `event_photos_details_orientation_type_foreign`(`orientation_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_preferences` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `type` ENUM('type', 'category', 'reach_via', 'market', 'filter', 'orientation', 'design', 'backdrop') NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_setup_details` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `contact_name` VARCHAR(255) NULL,
    `phone_number` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `location` LONGTEXT NULL,
    `is_parking_available` ENUM('yes', 'no') NOT NULL,
    `setup_location` ENUM('indoor', 'outdoor') NOT NULL,
    `available_for_setup` ENUM('yes', 'no') NOT NULL,
    `setup_details` LONGTEXT NULL,
    `is_elevator_available` ENUM('yes', 'no', 'not_needed') NOT NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `event_setup_details_event_id_foreign`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_venue_details` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `address_line_1` VARCHAR(255) NULL,
    `address_line_2` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `state_id` BIGINT UNSIGNED NULL,
    `zipcode` VARCHAR(255) NULL,
    `is_elevator_available` ENUM('yes', 'no') NULL,
    `COI` ENUM('send', 'not_require', 'require_custom', 'not_sure') NOT NULL,
    `document` LONGTEXT NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `event_venue_details_event_id_foreign`(`event_id`),
    INDEX `event_venue_details_state_id_foreign`(`state_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_date` DATE NOT NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `event_number` VARCHAR(255) NOT NULL,
    `availability_id` BIGINT UNSIGNED NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `state_id` BIGINT UNSIGNED NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `market` BIGINT UNSIGNED NULL,
    `package_id` BIGINT UNSIGNED NOT NULL,
    `is_event_planner` ENUM('yes', 'no') NOT NULL DEFAULT 'yes',
    `is_holder_on_reservation` ENUM('yes', 'no') NOT NULL DEFAULT 'yes',
    `planner_first_name` VARCHAR(255) NULL,
    `planner_last_name` VARCHAR(255) NULL,
    `planner_email` VARCHAR(255) NULL,
    `planner_phone_number` VARCHAR(255) NULL,
    `planner_company_name` VARCHAR(255) NULL,
    `type_id` BIGINT UNSIGNED NULL,
    `category_id` BIGINT UNSIGNED NULL,
    `reach_via` BIGINT UNSIGNED NULL,
    `guest_count` INTEGER NULL,
    `start_time` TIME(0) NULL,
    `end_time` TIME(0) NULL,
    `partner_id` BIGINT UNSIGNED NULL,
    `host_id` BIGINT UNSIGNED NULL,
    `agreement` VARCHAR(255) NULL,
    `admin_status` ENUM('invite', 'awaiting', 'detail_recieved', 'in_planning', 'awaiting_for_host', 'ready_to_execute', 'serviced') NULL,
    `customer_status` ENUM('awaiting', 'processing', 'in_planning', 'final_planning', 'ready_to_service', 'serviced') NULL,
    `is_agree` BOOLEAN NOT NULL DEFAULT false,

    INDEX `events_availability_id_foreign`(`availability_id`),
    INDEX `events_category_id_foreign`(`category_id`),
    INDEX `events_market_foreign`(`market`),
    INDEX `events_package_id_foreign`(`package_id`),
    INDEX `events_partner_employee_id_foreign`(`host_id`),
    INDEX `events_partner_id_foreign`(`partner_id`),
    INDEX `events_reach_via_foreign`(`reach_via`),
    INDEX `events_state_id_foreign`(`state_id`),
    INDEX `events_type_id_foreign`(`type_id`),
    INDEX `events_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faq_and_resources` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('faq', 'resources', 'video') NOT NULL,
    `display_order` BOOLEAN NULL DEFAULT true,
    `media` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `queue` VARCHAR(255) NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `attempts` TINYINT UNSIGNED NOT NULL,
    `reserved_at` INTEGER UNSIGNED NULL,
    `available_at` INTEGER UNSIGNED NOT NULL,
    `created_at` INTEGER UNSIGNED NOT NULL,

    INDEX `jobs_queue_index`(`queue`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module_roles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `module_code` VARCHAR(255) NOT NULL,
    `role_id` BIGINT UNSIGNED NOT NULL,
    `add_access` BOOLEAN NULL,
    `edit_access` BOOLEAN NULL,
    `view_access` BOOLEAN NULL,
    `delete_access` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,

    INDEX `module_roles_module_code_foreign`(`module_code`),
    INDEX `module_roles_role_id_foreign`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modules` (
    `code` VARCHAR(64) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `parent_code` VARCHAR(255) NULL,
    `singular_name` VARCHAR(156) NULL,
    `plural_name` VARCHAR(156) NULL,
    `display_order` INTEGER NULL,
    `is_menu` BOOLEAN NULL,
    `is_view` BOOLEAN NULL,
    `is_add` BOOLEAN NULL,
    `is_update` BOOLEAN NULL,
    `is_delete` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `notification_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `notification_users_notification_id_foreign`(`notification_id`),
    INDEX `notification_users_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(500) NOT NULL,
    `description` VARCHAR(1000) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `sub_title` VARCHAR(255) NOT NULL,
    `tag` VARCHAR(255) NULL,
    `display_order` INTEGER NULL,
    `picture` VARCHAR(255) NULL,
    `description` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `personal_access_tokens_token_unique`(`token`),
    INDEX `personal_access_tokens_tokenable_type_tokenable_id_index`(`tokenable_type`, `tokenable_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(156) NOT NULL,
    `description` VARCHAR(256) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,

    UNIQUE INDEX `roles_name_unique`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `states` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_images` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `ticket_images_ticket_id_foreign`(`ticket_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_request_types` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM('customer', 'partner') NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_trails` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL,
    `replay_from` BIGINT UNSIGNED NOT NULL,
    `message` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `ticket_trails_replay_from_foreign`(`replay_from`),
    INDEX `ticket_trails_ticket_id_foreign`(`ticket_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `ticket_number` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `status` ENUM('open', 'inprogress', 'close') NOT NULL DEFAULT 'open',
    `ticket_type` ENUM('partner', 'customer') NOT NULL,
    `event_id` BIGINT UNSIGNED NULL,
    `type_id` BIGINT UNSIGNED NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `tickets_event_id_foreign`(`event_id`),
    INDEX `tickets_type_id_foreign`(`type_id`),
    INDEX `tickets_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_details` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `address` TEXT NULL,
    `designation` VARCHAR(255) NULL,
    `partner_agreement` VARCHAR(255) NULL,
    `country_id` BIGINT UNSIGNED NULL,
    `state` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `zipcode` VARCHAR(15) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `user_details_country_id_foreign`(`country_id`),
    INDEX `user_details_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_event_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `user_event_tokens_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_signups` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `phone_number` VARCHAR(255) NULL,
    `event_id` VARCHAR(255) NULL,
    `verification_token` VARCHAR(64) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `type` ENUM('superadmin', 'member', 'partner', 'partneruser', 'customer') NOT NULL DEFAULT 'customer',
    `phone_number` VARCHAR(11) NULL,
    `picture` VARCHAR(255) NULL,
    `company` VARCHAR(50) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `role_id` BIGINT UNSIGNED NULL,
    `partner_id` BIGINT UNSIGNED NULL,
    `invite_token` VARCHAR(64) NULL,
    `is_first_login` BOOLEAN NULL,
    `invitation_status` ENUM('invited', 'accepted', 'rejected') NULL DEFAULT 'invited',
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `fcm_code` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `last_seen` TIMESTAMP(0) NULL,
    `module_flag` BOOLEAN NOT NULL DEFAULT false,
    `verification_token` VARCHAR(64) NULL,

    UNIQUE INDEX `users_company_unique`(`company`),
    UNIQUE INDEX `users_email_unique`(`email`),
    INDEX `users_partner_id_foreign`(`partner_id`),
    INDEX `users_role_id_foreign`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `availability_request_partners` ADD CONSTRAINT `availability_request_partners_availability_request_id_foreign` FOREIGN KEY (`availability_request_id`) REFERENCES `availability_requests`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `availability_request_partners` ADD CONSTRAINT `availability_request_partners_partner_id_foreign` FOREIGN KEY (`partner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `availability_requests` ADD CONSTRAINT `availability_requests_event_type_foreign` FOREIGN KEY (`event_type`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `availability_requests` ADD CONSTRAINT `availability_requests_market_id_foreign` FOREIGN KEY (`market_id`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `availability_requests` ADD CONSTRAINT `availability_requests_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `availability_requests` ADD CONSTRAINT `availability_requests_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chat_room_messages` ADD CONSTRAINT `chat_room_messages_chat_room_id_foreign` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_rooms`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chat_room_messages` ADD CONSTRAINT `chat_room_messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chat_room_messages` ADD CONSTRAINT `chat_room_messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chat_rooms` ADD CONSTRAINT `chat_rooms_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `country_partners` ADD CONSTRAINT `country_partners_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `country_partners` ADD CONSTRAINT `country_partners_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `customer_notifications` ADD CONSTRAINT `customer_notifications_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `customer_notifications` ADD CONSTRAINT `customer_notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_photos_details` ADD CONSTRAINT `event_photos_details_backdrop_type_foreign` FOREIGN KEY (`backdrop_type`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_photos_details` ADD CONSTRAINT `event_photos_details_design_type_foreign` FOREIGN KEY (`design_type`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_photos_details` ADD CONSTRAINT `event_photos_details_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_photos_details` ADD CONSTRAINT `event_photos_details_filter_type_foreign` FOREIGN KEY (`filter_type`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_photos_details` ADD CONSTRAINT `event_photos_details_orientation_type_foreign` FOREIGN KEY (`orientation_type`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_setup_details` ADD CONSTRAINT `event_setup_details_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_venue_details` ADD CONSTRAINT `event_venue_details_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_venue_details` ADD CONSTRAINT `event_venue_details_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_availability_id_foreign` FOREIGN KEY (`availability_id`) REFERENCES `availability_requests`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_market_foreign` FOREIGN KEY (`market`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_partner_employee_id_foreign` FOREIGN KEY (`host_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_partner_id_foreign` FOREIGN KEY (`partner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_reach_via_foreign` FOREIGN KEY (`reach_via`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `module_roles` ADD CONSTRAINT `module_roles_module_code_foreign` FOREIGN KEY (`module_code`) REFERENCES `modules`(`code`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `module_roles` ADD CONSTRAINT `module_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification_users` ADD CONSTRAINT `notification_users_notification_id_foreign` FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification_users` ADD CONSTRAINT `notification_users_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ticket_images` ADD CONSTRAINT `ticket_images_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ticket_trails` ADD CONSTRAINT `ticket_trails_replay_from_foreign` FOREIGN KEY (`replay_from`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ticket_trails` ADD CONSTRAINT `ticket_trails_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `ticket_request_types`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_details` ADD CONSTRAINT `user_details_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_details` ADD CONSTRAINT `user_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_event_tokens` ADD CONSTRAINT `user_event_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_partner_id_foreign` FOREIGN KEY (`partner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
