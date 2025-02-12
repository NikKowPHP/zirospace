-- Migration: Create Testimonials Tables for Supabase
CREATE TABLE IF NOT EXISTS zirospace_testimonials_en (
    id TEXT PRIMARY KEY,
    author TEXT,
    role TEXT,
    company TEXT,
    quote TEXT,
    image TEXT,
    image_alt TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS zirospace_testimonials_pl (
    id TEXT PRIMARY KEY,
    author TEXT,
    role TEXT,
    company TEXT,
    quote TEXT,
    image TEXT,
    image_alt TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);


-- Seeding: Insert Testimonials Data into Supabase Tables

-- Insert data into the English testimonials table
INSERT INTO zirospace_testimonials_en (id, author, role, company, quote, image, image_alt)
VALUES
  ('testimonial-en-1', 'John Doe', 'Software Engineer', 'Acme Corp', 'This is an example testimonial in English.', '/images/testimonials/testimonial.webp', 'John Doe'),
  ('testimonial-en-2', 'Jane Smith', 'Product Manager', 'Beta Inc', 'sadasdas dsad asd asd asd a fyuck you .', '/images/testimonials/testimonial.webp', 'Jane Smith'),
  ('testimonial-en-3', 'Mike Johnson', 'Data Scientist', 'Gamma Ltd', 'I found this service incredibly useful for my data analysis needs.', '/images/testimonials/testimonial.webp', 'Mike Johnson'),
  ('testimonial-en-4', 'Emily White', 'UX Designer', 'Delta Co', 'The user experience is top-notch, making my design process smoother.', '/images/testimonials/testimonial.webp', 'Emily White'),
  ('testimonial-en-5', 'David Brown', 'CEO', 'Epsilon Inc', 'Our company has seen significant improvements since using this product.', '/images/testimonials/testimonial.webp', 'David Brown');

-- Insert data into the Polish testimonials table
INSERT INTO zirospace_testimonials_pl (id, author, role, company, quote, image, image_alt)
VALUES
  ('testimonial-pl-1', 'Jan Kowalski', 'Inżynier Oprogramowania', 'Gamma Sp. z o.o.', 'To jest przykładowa opinia po polsku.', '/images/testimonials/testimonial.webp', 'Jan Kowalski'),
  ('testimonial-pl-2', 'Anna Nowak', 'Menadżer Produktu', 'Delta S.A.', 'Kolejna inspirująca opinia po polsku.', '/images/testimonials/testimonial.webp', 'Anna Nowak'),
  ('testimonial-pl-3', 'Piotr Zieliński', 'Naukowiec Danych', 'Omega Sp. z o.o.', 'Usługa ta okazała się niezwykle przydatna w moich analizach danych.', '/images/testimonials/testimonial.webp', 'Piotr Zieliński'),
  ('testimonial-pl-4', 'Maria Lewandowska', 'Projektant UX', 'Sigma S.A.', 'Doświadczenie użytkownika jest na najwyższym poziomie, co usprawnia mój proces projektowania.', '/images/testimonials/testimonial.webp', 'Maria Lewandowska'),
  ('testimonial-pl-5', 'Tomasz Dąbrowski', 'Dyrektor Generalny', 'Alfa Sp. z o.o.', 'Nasza firma odnotowała znaczne ulepszenia od czasu wprowadzenia tego produktu.', '/images/testimonials/testimonial.webp', 'Tomasz Dąbrowski');