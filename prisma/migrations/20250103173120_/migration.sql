/*
  Warnings:

  - A unique constraint covering the columns `[extractedId]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stream_extractedId_key" ON "Stream"("extractedId");
