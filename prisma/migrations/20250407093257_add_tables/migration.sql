/*
  Warnings:

  - You are about to drop the `zirospace_blog_posts_en` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zirospace_blog_posts_pl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zirospace_case_studies_en` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zirospace_case_studies_pl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zirospace_testimonials_en` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zirospace_testimonials_pl` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "zirospace_blog_posts_en";

-- DropTable
DROP TABLE "zirospace_blog_posts_pl";

-- DropTable
DROP TABLE "zirospace_case_studies_en";

-- DropTable
DROP TABLE "zirospace_case_studies_pl";

-- DropTable
DROP TABLE "zirospace_testimonials_en";

-- DropTable
DROP TABLE "zirospace_testimonials_pl";

-- CreateTable
CREATE TABLE "zirospace_case_studies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "images" JSONB NOT NULL,
    "cta_text" TEXT NOT NULL,
    "cta_text_name" TEXT NOT NULL,
    "cta_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "locale" TEXT NOT NULL,

    CONSTRAINT "zirospace_case_studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_alt" TEXT,
    "excerpt" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT NOT NULL,

    CONSTRAINT "zirospace_blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_testimonials" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "image_alt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "locale" TEXT NOT NULL,

    CONSTRAINT "zirospace_testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_banners" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "image_url" TEXT,
    "link" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "locale" TEXT NOT NULL,

    CONSTRAINT "zirospace_banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_case_studies_slug_locale_key" ON "zirospace_case_studies"("slug", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_blog_posts_slug_locale_key" ON "zirospace_blog_posts"("slug", "locale");
