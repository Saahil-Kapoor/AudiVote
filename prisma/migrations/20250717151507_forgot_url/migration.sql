/*
  Warnings:

  - Added the required column `url` to the `currPlaying` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "currPlaying" ADD COLUMN     "url" TEXT NOT NULL;
