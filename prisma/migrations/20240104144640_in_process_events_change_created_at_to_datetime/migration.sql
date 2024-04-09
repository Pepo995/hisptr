-- AlterTable
ALTER TABLE `in_process_events` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
