-- AlterTable
ALTER TABLE `invoices` MODIFY `customer_id` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `payments` MODIFY `booking_id` CHAR(36) NOT NULL,
    MODIFY `order_id` CHAR(36) NULL,
    MODIFY `customer_id` CHAR(36) NOT NULL;
