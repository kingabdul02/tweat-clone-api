-- CreateTable
CREATE TABLE `SharedWithMePost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sharedId` INTEGER NULL,
    `postId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SharedWithMePost` ADD CONSTRAINT `SharedWithMePost_sharedId_fkey` FOREIGN KEY (`sharedId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedWithMePost` ADD CONSTRAINT `SharedWithMePost_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
