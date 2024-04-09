-- CreateTable
CREATE TABLE `VenueClosestMarket` (
    `venue` VARCHAR(255) NOT NULL,
    `distance` INTEGER UNSIGNED NOT NULL,
    `marketId` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`venue`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
