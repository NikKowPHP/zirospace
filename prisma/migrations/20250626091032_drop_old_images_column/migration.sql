/*
  Warnings:

  - You are about to drop the column `images` on the `zirospace_case_studies_en` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `zirospace_case_studies_pl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "zirospace_case_studies_en" DROP COLUMN "images";

-- AlterTable
ALTER TABLE "zirospace_case_studies_pl" DROP COLUMN "images";
