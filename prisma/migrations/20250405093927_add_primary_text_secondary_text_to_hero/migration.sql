/*
  Warnings:

  - You are about to drop the column `cta_link` on the `zirospace_hero` table. All the data in the column will be lost.
  - You are about to drop the column `cta_text` on the `zirospace_hero` table. All the data in the column will be lost.
  - Added the required column `cta_primary_link` to the `zirospace_hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cta_primary_text` to the `zirospace_hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cta_secondary_link` to the `zirospace_hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cta_secondary_text` to the `zirospace_hero` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "zirospace_hero" DROP COLUMN "cta_link",
DROP COLUMN "cta_text",
ADD COLUMN     "cta_primary_link" TEXT NOT NULL,
ADD COLUMN     "cta_primary_text" TEXT NOT NULL,
ADD COLUMN     "cta_secondary_link" TEXT NOT NULL,
ADD COLUMN     "cta_secondary_text" TEXT NOT NULL;
