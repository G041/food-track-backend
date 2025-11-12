/*
  Warnings:

  - Made the column `latitude` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurant" (
    "id_restaurant" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurant_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "menu_link" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);
INSERT INTO "new_Restaurant" ("description", "id_restaurant", "latitude", "location", "longitude", "menu_link", "restaurant_name") SELECT "description", "id_restaurant", "latitude", "location", "longitude", "menu_link", "restaurant_name" FROM "Restaurant";
DROP TABLE "Restaurant";
ALTER TABLE "new_Restaurant" RENAME TO "Restaurant";
CREATE INDEX "Restaurant_latitude_longitude_idx" ON "Restaurant"("latitude", "longitude");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
