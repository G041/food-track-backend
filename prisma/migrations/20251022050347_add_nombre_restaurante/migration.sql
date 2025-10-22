/*
  Warnings:

  - Added the required column `nombre_restaurante` to the `Restaurante` table without a default value. This is not possible if the table is not empty.
  - Made the column `link_menu` on table `Restaurante` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ubicacion` on table `Restaurante` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurante" (
    "id_restaurante" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_restaurante" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "link_menu" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL
);
INSERT INTO "new_Restaurante" ("descripcion", "id_restaurante", "link_menu", "ubicacion") SELECT "descripcion", "id_restaurante", "link_menu", "ubicacion" FROM "Restaurante";
DROP TABLE "Restaurante";
ALTER TABLE "new_Restaurante" RENAME TO "Restaurante";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
