-- AlterTable
ALTER TABLE `events` MODIFY `admin_status` ENUM('invite', 'awaiting', 'detail_recieved', 'in_planning', 'awaiting_for_host', 'ready_to_execute', 'serviced', 'cancelled', 'confirmed') NULL,
    MODIFY `customer_status` ENUM('awaiting', 'processing', 'in_planning', 'final_planning', 'ready_to_service', 'serviced', 'cancelled', 'confirmed') NULL;
