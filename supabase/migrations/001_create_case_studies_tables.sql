-- Create English case studies table
CREATE TABLE case_studies_en (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL,
  images jsonb NOT NULL,
  cta_text text NOT NULL,
  cta_text_name text NOT NULL,
  cta_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Polish case studies table
CREATE TABLE case_studies_pl (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL,
  images jsonb NOT NULL,
  cta_text text NOT NULL,
  cta_text_name text NOT NULL,
  cta_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for both tables
ALTER TABLE case_studies_en ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies_pl ENABLE ROW LEVEL SECURITY;

-- Allow public read access for both tables
CREATE POLICY "Allow public read access on English case studies"
  ON case_studies_en FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on Polish case studies"
  ON case_studies_pl FOR SELECT
  USING (true); 