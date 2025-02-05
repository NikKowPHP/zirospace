-- Add slug column to both tables
ALTER TABLE case_studies_en ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE case_studies_pl ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Update existing records with slugs based on titles
UPDATE case_studies_en
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

UPDATE case_studies_pl
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Make slug column required
ALTER TABLE case_studies_en ALTER COLUMN slug SET NOT NULL;
ALTER TABLE case_studies_pl ALTER COLUMN slug SET NOT NULL; 