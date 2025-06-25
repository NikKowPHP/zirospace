-- Enable the UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "case_studies_en" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT,
    "images" JSONB NOT NULL,
    "cta_text" TEXT NOT NULL,
    "cta_text_name" TEXT NOT NULL,
    "cta_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "slug" TEXT NOT NULL,
    "order_index" INTEGER DEFAULT 0,

    CONSTRAINT "case_studies_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_studies_en_backup" (
    "id" TEXT,
    "title" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "images" JSONB,
    "cta_text" TEXT,
    "cta_text_name" TEXT,
    "cta_url" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6)
);

-- CreateTable
CREATE TABLE "case_studies_pl" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT,
    "images" JSONB NOT NULL,
    "cta_text" TEXT NOT NULL,
    "cta_text_name" TEXT NOT NULL,
    "cta_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "slug" TEXT NOT NULL,
    "order_index" INTEGER DEFAULT 0,

    CONSTRAINT "case_studies_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_studies_pl_backup" (
    "id" TEXT,
    "title" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "images" JSONB,
    "cta_text" TEXT,
    "cta_text_name" TEXT,
    "cta_url" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6)
);

-- CreateTable
CREATE TABLE "medical_products" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "image_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medical_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_slider" (
    "id" VARCHAR NOT NULL,
    "image_url" VARCHAR NOT NULL,

    CONSTRAINT "medical_slider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor_quote_section" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "quote" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professor_quote_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proffessor_news" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "tag" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_alt" TEXT,
    "excerpt" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proffessor_news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proffessor_youtube_section" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "youtube_url" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proffessor_youtube_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slider_items" (
    "id" VARCHAR NOT NULL,
    "image_url" VARCHAR NOT NULL,

    CONSTRAINT "slider_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials_en" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "image_alt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "testimonials_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials_pl" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "image_alt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "testimonials_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ziroagency_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "ziroagency_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_app_ratings" (
    "id" BIGSERIAL NOT NULL,
    "app_id" BIGINT NOT NULL,
    "user_id" VARCHAR,
    "rating_value" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_app_tags" (
    "app_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_app_tags_pkey" PRIMARY KEY ("app_id","tag_id")
);

-- CreateTable
CREATE TABLE "zirospace_apps" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "thumbnail_url" VARCHAR,
    "average_rating" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_banners_en" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subtitle" TEXT,
    "image_url" TEXT,
    "start_date" TIMESTAMPTZ(6),
    "end_date" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "cta_button_text" TEXT,
    "cta_button_link" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "youtube_url" VARCHAR(255),

    CONSTRAINT "zirospace_banners_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_banners_pl" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subtitle" TEXT,
    "image_url" TEXT,
    "start_date" TIMESTAMPTZ(6),
    "end_date" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "cta_button_text" TEXT,
    "cta_button_link" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "youtube_url" VARCHAR(255),

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
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

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
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_blog_posts_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_studies_en" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "tags" TEXT,
    "images" TEXT,
    "cta_text" TEXT,
    "cta_text_name" TEXT,
    "cta_url" TEXT,
    "color" VARCHAR(7),
    "background_color" VARCHAR(7),
    "theme" VARCHAR(50),
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_case_studies_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_studies_pl" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "images" TEXT,
    "cta_text" TEXT,
    "cta_text_name" TEXT,
    "cta_url" TEXT,
    "color" VARCHAR(7),
    "background_color" VARCHAR(7),
    "theme" VARCHAR(50),
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_case_studies_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_study_slider_images" (
    "id" TEXT NOT NULL,
    "slider_id" TEXT NOT NULL,
    "image" TEXT,
    "alt" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_case_study_slider_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_case_study_sliders" (
    "id" TEXT NOT NULL,
    "theme" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_case_study_sliders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_hero_en" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "background_image" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_hero_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_hero_pl" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "background_image" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_hero_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_screenshot_ratings" (
    "id" BIGSERIAL NOT NULL,
    "screenshot_id" BIGINT NOT NULL,
    "user_id" VARCHAR,
    "rating_value" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screenshot_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_screenshots" (
    "id" BIGSERIAL NOT NULL,
    "app_id" BIGINT NOT NULL,
    "image_url" VARCHAR NOT NULL,
    "screen_name" VARCHAR,
    "route_path" VARCHAR,
    "description" TEXT,
    "order_index" INTEGER DEFAULT 0,
    "average_rating" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screenshots_pkey" PRIMARY KEY ("id")
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
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

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
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_services_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_tags" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_tags_pkey" PRIMARY KEY ("id")
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
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

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
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_testimonials_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_updates_en" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publish_date" TIMESTAMPTZ(6) NOT NULL,
    "content_html" TEXT,
    "excerpt" TEXT,
    "image_url" TEXT,
    "image_alt" TEXT,
    "is_published" BOOLEAN DEFAULT false,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_updates_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_updates_pl" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publish_date" TIMESTAMPTZ(6) NOT NULL,
    "content_html" TEXT,
    "excerpt" TEXT,
    "image_url" TEXT,
    "image_alt" TEXT,
    "is_published" BOOLEAN DEFAULT false,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_updates_pl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_youtube" (
    "id" TEXT NOT NULL,
    "youtube_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_youtube_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_en_slug_unique" ON "case_studies_en"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_pl_slug_unique" ON "case_studies_pl"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "proffessor_news_slug_key" ON "proffessor_news"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ziroagency_tags_name_key" ON "ziroagency_tags"("name");

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
CREATE UNIQUE INDEX "zirospace_tags_name_key" ON "zirospace_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_updates_en_slug_key" ON "zirospace_updates_en"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "zirospace_updates_pl_slug_key" ON "zirospace_updates_pl"("slug");

-- AddForeignKey
ALTER TABLE "zirospace_app_ratings" ADD CONSTRAINT "zirospace_app_ratings_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "zirospace_apps"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zirospace_app_tags" ADD CONSTRAINT "zirospace_app_tags_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "zirospace_apps"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zirospace_app_tags" ADD CONSTRAINT "zirospace_app_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "zirospace_tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zirospace_case_study_slider_images" ADD CONSTRAINT "fk_slider" FOREIGN KEY ("slider_id") REFERENCES "zirospace_case_study_sliders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zirospace_screenshot_ratings" ADD CONSTRAINT "zirospace_screenshot_ratings_screenshot_id_fkey" FOREIGN KEY ("screenshot_id") REFERENCES "zirospace_screenshots"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zirospace_screenshots" ADD CONSTRAINT "zirospace_screenshots_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "zirospace_apps"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
