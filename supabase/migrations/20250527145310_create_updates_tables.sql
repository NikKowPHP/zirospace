CREATE TABLE zirospace_updates_en (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  publish_date TIMESTAMPTZ NOT NULL,
  content_html TEXT,
  excerpt TEXT,
  image_url TEXT,
  image_alt TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE zirospace_updates_en ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON zirospace_updates_en
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE TABLE zirospace_updates_pl (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  publish_date TIMESTAMPTZ NOT NULL,
  content_html TEXT,
  excerpt TEXT,
  image_url TEXT,
  image_alt TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE zirospace_updates_pl ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON zirospace_updates_pl
AS PERMISSIVE FOR SELECT
TO public
USING (true);