-- CreateTable
CREATE TABLE "zirospace_banners_en" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subtitle" TEXT,
    "image_url" TEXT,
    "youtube_url" VARCHAR,
    "start_date" TIMESTAMPTZ,
    "end_date" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "cta_button_text" TEXT,
    "cta_button_link" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "zirospace_banners_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_banners_pl" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subtitle" TEXT,
    "image_url" TEXT,
    "youtube_url" VARCHAR,
    "start_date" TIMESTAMPTZ,
    "end_date" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "cta_button_text" TEXT,
    "cta_button_link" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "zirospace_banners_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_blog_posts_en" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_alt" TEXT,
    "excerpt" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "is_pinned" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_blog_posts_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_blog_posts_pl" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_alt" TEXT,
    "excerpt" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "is_pinned" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_blog_posts_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_studies_en" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "images" TEXT,
    "tags" TEXT[],
    "cta_url" TEXT,
    "color" VARCHAR,
    "background_color" VARCHAR,
    "theme" VARCHAR,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_case_studies_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_studies_pl" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "images" TEXT,
    "tags" TEXT[],
    "cta_url" TEXT,
    "color" VARCHAR,
    "background_color" VARCHAR,
    "theme" VARCHAR,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_case_studies_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_study_sliders" (
    "id" TEXT NOT NULL,
    "theme" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_case_study_sliders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_study_slider_images" (
    "id" TEXT NOT NULL,
    "slider_id" TEXT NOT NULL,
    "image" TEXT,
    "alt" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_case_study_slider_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_hero_en" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "background_image" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_hero_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_hero_pl" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "background_image" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_hero_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_services_en" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "content_html" TEXT,
    "excerpt" TEXT,
    "image_url" TEXT,
    "image_alt" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "keywords" TEXT[],
    "is_published" BOOLEAN DEFAULT true,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_services_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_services_pl" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "content_html" TEXT,
    "excerpt" TEXT,
    "image_url" TEXT,
    "image_alt" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "keywords" TEXT[],
    "is_published" BOOLEAN DEFAULT true,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_services_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_testimonials_en" (
    "id" TEXT NOT NULL,
    "author" TEXT,
    "role" TEXT,
    "company" TEXT,
    "quote" TEXT,
    "image" TEXT,
    "image_alt" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_testimonials_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_testimonials_pl" (
    "id" TEXT NOT NULL,
    "author" TEXT,
    "role" TEXT,
    "company" TEXT,
    "quote" TEXT,
    "image" TEXT,
    "image_alt" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_testimonials_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_updates_en" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publish_date" TIMESTAMPTZ NOT NULL,
    "content_html" TEXT,
    "excerpt" TEXT,
    "image_url" TEXT,
    "image_alt" TEXT,
    "is_published" BOOLEAN DEFAULT false,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_updates_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_updates_pl" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publish_date" TIMESTAMPTZ NOT NULL,
    "content_html" TEXT,
    "excerpt" TEXT,
    "image_url" TEXT,
    "image_alt" TEXT,
    "is_published" BOOLEAN DEFAULT false,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "zirospace_updates_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_youtube" (
    "id" TEXT NOT NULL,
    "youtube_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "zirospace_youtube_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_blog_posts_en_slug_key" ON "zirospace_blog_posts_en"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_blog_posts_pl_slug_key" ON "zirospace_blog_posts_pl"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_case_studies_en_slug_key" ON "zirospace_case_studies_en"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_case_studies_pl_slug_key" ON "zirospace_case_studies_pl"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_services_en_slug_key" ON "zirospace_services_en"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_services_pl_slug_key" ON "zirospace_services_pl"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_updates_en_slug_key" ON "zirospace_updates_en"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_updates_pl_slug_key" ON "zirospace_updates_pl"("slug");

-- AddForeignKey
ALTER TABLE "zirospace_case_study_slider_images" ADD CONSTRAINT "zirospace_case_study_slider_images_slider_id_fkey" FOREIGN KEY ("slider_id") REFERENCES "zirospace_case_study_sliders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
