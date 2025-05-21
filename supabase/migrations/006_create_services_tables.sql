CREATE TABLE zirospace_services_en (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    content_html TEXT,
    excerpt TEXT,
    image_url TEXT,
    image_alt TEXT,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    is_published BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE zirospace_services_pl (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    content_html TEXT,
    excerpt TEXT,
    image_url TEXT,
    image_alt TEXT,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    is_published BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);