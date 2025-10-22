/*
  Warnings:

  - You are about to drop the `Restaurante` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Restaurante";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Restaurant" (
    "id_restaurant" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurant_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "menu_link" TEXT NOT NULL,
    "location" TEXT NOT NULL
);
