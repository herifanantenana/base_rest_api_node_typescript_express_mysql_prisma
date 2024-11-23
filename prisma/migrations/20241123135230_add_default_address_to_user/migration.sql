-- AlterTable
ALTER TABLE `users` ADD COLUMN `defaultBillingAddressId` INTEGER NULL,
    ADD COLUMN `defaultShippingAddressId` INTEGER NULL;
