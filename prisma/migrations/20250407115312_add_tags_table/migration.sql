/*
  Warnings:

  - You are about to drop the column `cta_text` on the `zirospace_case_studies` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `zirospace_case_studies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "zirospace_case_studies" DROP COLUMN "cta_text",
DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "zirospace_case_study_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zirospace_case_study_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaseStudyToCaseStudyTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaseStudyToCaseStudyTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CaseStudyToCaseStudyTags_B_index" ON "_CaseStudyToCaseStudyTags"("B");

-- AddForeignKey
ALTER TABLE "_CaseStudyToCaseStudyTags" ADD CONSTRAINT "_CaseStudyToCaseStudyTags_A_fkey" FOREIGN KEY ("A") REFERENCES "zirospace_case_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToCaseStudyTags" ADD CONSTRAINT "_CaseStudyToCaseStudyTags_B_fkey" FOREIGN KEY ("B") REFERENCES "zirospace_case_study_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
