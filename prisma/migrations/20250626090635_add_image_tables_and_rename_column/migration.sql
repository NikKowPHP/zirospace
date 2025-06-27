-- CreateTable
CREATE TABLE "zirospace_case_study_images_en" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caseStudyId" TEXT NOT NULL,

    CONSTRAINT "zirospace_case_study_images_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_study_images_pl" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caseStudyId" TEXT NOT NULL,

    CONSTRAINT "zirospace_case_study_images_pl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "zirospace_case_study_images_en" ADD CONSTRAINT "zirospace_case_study_images_en_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "zirospace_case_studies_en"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zirospace_case_study_images_pl" ADD CONSTRAINT "zirospace_case_study_images_pl_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "zirospace_case_studies_pl"("id") ON DELETE CASCADE ON UPDATE CASCADE;
