-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN "latitude" REAL;
ALTER TABLE "Restaurant" ADD COLUMN "longitude" REAL;

-- CreateIndex
CREATE INDEX "Restaurant_latitude_longitude_idx" ON "Restaurant"("latitude", "longitude");
