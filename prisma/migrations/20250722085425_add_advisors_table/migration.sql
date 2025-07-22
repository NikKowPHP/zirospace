-- CreateTable
CREATE TABLE "zirospace_advisors_en" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT,
    "image_url" TEXT,
    "image_alt" TEXT,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_advisors_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_advisors_pl" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT,
    "image_url" TEXT,
    "image_alt" TEXT,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_advisors_pl_pkey" PRIMARY KEY ("id")
);
