/*
  Warnings:

  - Added the required column `username` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contacts` ADD COLUMN `username` VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
