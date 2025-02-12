-- Migration: Create Case Study Sliders Tables for Supabase with Zirospace prefix

-- Create table for sliders
CREATE TABLE IF NOT EXISTS zirospace_case_study_sliders (
  id TEXT PRIMARY KEY,
  theme TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for slider images
CREATE TABLE IF NOT EXISTS zirospace_case_study_slider_images (
  id TEXT PRIMARY KEY,
  slider_id TEXT NOT NULL,
  image TEXT,
  alt TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_slider
    FOREIGN KEY (slider_id)
    REFERENCES zirospace_case_study_sliders(id)
);

-- Seeding: Insert Sample Data into zirospace_case_study_sliders and zirospace_case_study_slider_images

-- Insert a sample slider record
INSERT INTO zirospace_case_study_sliders (id, theme)
VALUES
  ('example-slider-en-1', 'light');

-- Insert sample slider image records for the above slider
INSERT INTO zirospace_case_study_slider_images (id, slider_id, image, alt)
VALUES
  ('example-slider-image-en-1', 'example-slider-en-1', '/images/case-studies/gsense/gsense.avif', 'hf 01'),
  ('example-slider-image-en-2', 'example-slider-en-1', '/images/case-studies/iqubx/iqubx.avif', 'hf 02'),
  ('example-slider-image-en-3', 'example-slider-en-1', '/images/case-studies/gsense/gsense.avif', 'hf 03'),
  ('example-slider-image-en-4', 'example-slider-en-1', '/images/case-studies/gsense/gsense.avif', 'hf 04'),
  ('example-slider-image-en-5', 'example-slider-en-1', '/images/case-studies/gsense/gsense.avif', 'hf 05');