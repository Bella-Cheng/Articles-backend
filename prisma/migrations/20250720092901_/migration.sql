-- AlterTable
ALTER TABLE `User` MODIFY `email` VARCHAR(500) NOT NULL,
    MODIFY `password` VARCHAR(255) NULL,
    MODIFY `providerUserId` VARCHAR(255) NULL,
    MODIFY `modifier` VARCHAR(255) NULL,
    MODIFY `modifyAt` DATETIME(3) NULL;
