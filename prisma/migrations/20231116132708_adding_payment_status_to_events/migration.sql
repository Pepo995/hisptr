-- AlterTable
ALTER TABLE `events` MODIFY `payment_status` ENUM('pending', 'completed', 'holded', 'one_of_two') NOT NULL DEFAULT 'pending';
