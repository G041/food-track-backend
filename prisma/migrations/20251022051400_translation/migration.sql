/*
  Warnings:

  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Restaurante` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `descripcion` on the `Restaurante` table. All the data in the column will be lost.
  - You are about to drop the column `id_restaurante` on the `Restaurante` table. All the data in the column will be lost.
  - You are about to drop the column `link_menu` on the `Restaurante` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_restaurante` on the `Restaurante` table. All the data in the column will be lost.
  - You are about to drop the column `ubicacion` on the `Restaurante` table. All the data in the column will be lost.
  - Added the required column `description` to the `Restaurante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_restaurant` to the `Restaurante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Restaurante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menu_link` to the `Restaurante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurant_name` to the `Restaurante` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Usuario_correo_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Usuario";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id_user" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurante" (
    "id_restaurant" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurant_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "menu_link" TEXT NOT NULL,
    "location" TEXT NOT NULL
);
DROP TABLE "Restaurante";
ALTER TABLE "new_Restaurante" RENAME TO "Restaurante";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
