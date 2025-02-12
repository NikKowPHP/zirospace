-- Migration: Create zirospace_case_studies tables

CREATE TABLE IF NOT EXISTS zirospace_case_studies_en (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  tags TEXT, -- stored as comma-separated values
  images TEXT, -- stored as JSON string
  cta_text TEXT,
  cta_text_name TEXT,
  cta_url TEXT,
  color VARCHAR(7),
  background_color VARCHAR(7),
  theme VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS zirospace_case_studies_pl (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  tags TEXT, -- stored as comma-separated values
  images TEXT, -- stored as JSON string
  cta_text TEXT,
  cta_text_name TEXT,
  cta_url TEXT,
  color VARCHAR(7),
  background_color VARCHAR(7),
  theme VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seeding: Insert sample data into zirospace_case_studies tables

-- Insert data into English case studies table
INSERT INTO zirospace_case_studies_en (
  id, slug, title, subtitle, description, tags, images, cta_text, cta_text_name, cta_url, color, background_color, theme, order_index
) VALUES
('example-case-study-en-1',
 'example-case-study-en-1',
 'Example Case Study EN 1',
 'Example Subtitle EN 1',
 'Example Description EN 1',
 'tag1,tag2',
 '[{"url": "/images/case-studies/gsense/gsense.avif", "alt": "Example Image 1 Alt Text"}, {"url": "/images/case-studies/gsense/gsense.avif", "alt": "Example Image 2 Alt Text"}]',
 'Learn More',
 'caseStudy.ctaText.viewCaseStudy',
 '/case-studies/example-case-study-en-1',
 '#FFFFFF',
 '#F0F0F0',
 'dark',
 0
),
('example-case-study-en-2',
 'example-case-study-en-2',
 'Example Case Study EN 2',
 'Example Subtitle EN 2',
 'Example Description EN 2',
 'tag3,tag4',
 '[{"url": "/images/case-studies/gsense/gsense.avif", "alt": "Example Image 3 Alt Text"}, {"url": "/images/case-studies/gsense/gsense.avif", "alt": "Example Image 4 Alt Text"}]',
 'Explore Now',
 'caseStudy.ctaText.viewCaseStudy',
 '/case-studies/example-case-study-en-2',
 '#000000',
 '#E0E0E0',
 'light',
 1
);

-- Insert data into Polish case studies table
INSERT INTO zirospace_case_studies_pl (
  id, slug, title, subtitle, description, tags, images, cta_text, cta_text_name, cta_url, color, background_color, theme, order_index
) VALUES
('example-case-study-pl-1',
 'example-case-study-pl-1',
 'Example Case Study PL 1',
 'Example Subtitle PL 1',
 'Example Description PL 1',
 'tag1,tag2',
 '[{"url": "/images/case-studies/gsense/gsense.avif", "alt": "Przykład Obraz 1 Alt Tekst"}, {"url": "/images/case-studies/gsense/gsense.avif", "alt": "Przykład Obraz 2 Alt Tekst"}]',
 'Dowiedz się więcej',
 'caseStudy.ctaText.viewCaseStudy',
 '/pl/case-studies/example-case-study-pl-1',
 '#FFFFFF',
 '#F0F0F0',
 'light',
 0
),
('example-case-study-pl-2',
 'example-case-study-pl-2',
 'Example Case Study PL 2',
 'Example Subtitle PL 2',
 'Example Description PL 2',
 'tag3,tag4',
 '[{"url": "/images/case-studies/gsense/gsense.avif", "alt": "Przykład Obraz 3 Alt Tekst"}, {"url": "/images/case-studies/gsense/gsense.avif", "alt": "Przykład Obraz 4 Alt Tekst"}]',
 'Eksploruj Teraz',
 'caseStudy.ctaText.viewCaseStudy',
 '/pl/case-studies/example-case-study-pl-2',
 '#000000',
 '#E0E0E0',
 'dark',
 1
);