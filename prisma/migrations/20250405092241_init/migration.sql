-- CreateTable
CREATE TABLE "zirospace_youtube" (
    "id" TEXT NOT NULL,
    "youtube_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zirospace_youtube_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_studies_en" (
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

    CONSTRAINT "zirospace_case_studies_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_studies_pl" (
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

    CONSTRAINT "zirospace_case_studies_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_blog_posts_en" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_alt" TEXT,
    "excerpt" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "zirospace_blog_posts_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_blog_posts_pl" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_alt" TEXT,
    "excerpt" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "zirospace_blog_posts_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_testimonials_en" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "image_alt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zirospace_testimonials_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_testimonials_pl" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "image_alt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zirospace_testimonials_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_study_sliders" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zirospace_case_study_sliders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_study_images" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sliderId" TEXT,

    CONSTRAINT "zirospace_case_study_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_hero" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "cta_text" TEXT NOT NULL,
    "cta_link" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zirospace_hero_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_blog_posts_en_slug_key" ON "zirospace_blog_posts_en"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_blog_posts_pl_slug_key" ON "zirospace_blog_posts_pl"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_hero_locale_key" ON "zirospace_hero"("locale");

-- AddForeignKey
ALTER TABLE "zirospace_case_study_images" ADD CONSTRAINT "zirospace_case_study_images_sliderId_fkey" FOREIGN KEY ("sliderId") REFERENCES "zirospace_case_study_sliders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
