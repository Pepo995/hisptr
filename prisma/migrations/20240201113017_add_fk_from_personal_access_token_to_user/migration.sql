-- AlterTable
ALTER TABLE `in_process_events` ADD COLUMN `budgetForPrice` INTEGER UNSIGNED NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `personal_access_tokens` ADD CONSTRAINT `personal_access_tokens_tokenable_id_foreign` FOREIGN KEY (`tokenable_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
