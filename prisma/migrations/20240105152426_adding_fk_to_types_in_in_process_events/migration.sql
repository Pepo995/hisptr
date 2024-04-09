-- AddForeignKey
ALTER TABLE `in_process_events` ADD CONSTRAINT `in_process_events_type_id_foreign` FOREIGN KEY (`typeId`) REFERENCES `event_preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
