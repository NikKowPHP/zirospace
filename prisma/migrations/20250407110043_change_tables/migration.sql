/*
  Warnings:

  - You are about to drop the column `subtitle` on the `zirospace_banners` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `zirospace_case_studies` table. All the data in the column will be lost.
  - You are about to drop the column `sliderId` on the `zirospace_case_study_images` table. All the data in the column will be lost.
  - Added the required column `background_color` to the `zirospace_case_studies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `zirospace_case_studies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `zirospace_case_studies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caseStudyId` to the `zirospace_case_study_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "zirospace_case_study_images" DROP CONSTRAINT "zirospace_case_study_images_sliderId_fkey";

-- AlterTable
ALTER TABLE "zirospace_banners" DROP COLUMN "subtitle",
ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "zirospace_case_studies" DROP COLUMN "images",
ADD COLUMN     "background_color" TEXT NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "theme" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "zirospace_case_study_images" DROP COLUMN "sliderId",
ADD COLUMN     "caseStudyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "zirospace_case_study_slider_images" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sliderId" TEXT,

    CONSTRAINT "zirospace_case_study_slider_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "zirospace_case_study_images_caseStudyId_idx" ON "zirospace_case_study_images"("caseStudyId");

-- AddForeignKey
ALTER TABLE "zirospace_case_study_images" ADD CONSTRAINT "zirospace_case_study_images_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "zirospace_case_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zirospace_case_study_slider_images" ADD CONSTRAINT "zirospace_case_study_slider_images_sliderId_fkey" FOREIGN KEY ("sliderId") REFERENCES "zirospace_case_study_sliders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
