/*
  Warnings:

  - You are about to drop the column `status` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `plans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "status",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "objects" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "status",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "Status";
