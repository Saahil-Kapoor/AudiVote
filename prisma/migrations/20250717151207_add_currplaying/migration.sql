-- CreateTable
CREATE TABLE "currPlaying" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "currPlaying_pkey" PRIMARY KEY ("id")
);
