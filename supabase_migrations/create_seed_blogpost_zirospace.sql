-- Migration: Create zirospace_blog_posts tables for English and Polish

CREATE TABLE IF NOT EXISTS zirospace_blog_posts_en (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  excerpt TEXT NOT NULL,
  content_html TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS zirospace_blog_posts_pl (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  excerpt TEXT NOT NULL,
  content_html TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);



-- Seeding: Insert Sample Blog Posts for English and Polish

-- Insert records into the English blog posts table
INSERT INTO zirospace_blog_posts_en (slug, title, image_url, image_alt, excerpt, content_html, is_pinned)
VALUES
  (
    'first-post',
    'First Blog Post',
    '/images/case-studies/gsense/gsense.avif',
    'First Blog Post',
    '<p><em>Excerpt:</em> This is a comprehensive introduction to our first blog post, covering a range of topics and designed to engage readers from start to finish.</p>',
    ' \
<h1>Introduction</h1>\
<p>Welcome to our first blog post! In this article, we\'ll explore various aspects of modern web development...</p>\
<h2>Section 1: Understanding the Basics</h2>\
<p>Before diving into advanced topics, let\'s cover some fundamental concepts...</p>\
',
    true
  ),
  (
    'second-post',
    'Second Blog Post: Deep Dive into Next.js',
    '/images/case-studies/gsense/gsense.avif',
    'Second Blog Post',
    '<p><em>Excerpt:</em> A detailed exploration of Next.js features and best practices for building modern web applications.</p>',
    ' \
<p>In this post, we delve into the advanced features of Next.js, including server-side rendering, static site generation, and API routes...</p>\
<p>Learn how to leverage Next.js to create fast, scalable, and SEO-friendly web applications.</p>\
<img src="/images/case-studies/gsense/gsense.avif" alt="Next.js" />',
    false
  ),
  (
    'third-post',
    'Third Blog Post: The Future of Web Development',
    '/images/case-studies/gsense/gsense.avif',
    'Third Blog Post',
    '<p><em>Excerpt:</em> An overview of the emerging trends and technologies that are shaping the future of web development.</p>',
    ' \
<p>This post explores the latest trends in web development, such as WebAssembly, serverless computing, and progressive web apps...</p>\
<img src="/images/case-studies/gsense/gsense.avif" alt="Web Development Trends" />\
<p>Stay ahead of the curve by understanding the technologies that will define the future of the web.</p>',
    false
  );

-- Insert records into the Polish blog posts table
INSERT INTO zirospace_blog_posts_pl (slug, title, image_url, image_alt, excerpt, content_html, is_pinned)
VALUES
  (
    'pierwszy-post',
    'Pierwszy Post na Blogu',
    '/images/case-studies/gsense/gsense.avif',
    'Pierwszy Post na Blogu',
    '<p><em>Fragment:</em> To kompleksowe wprowadzenie do naszego pierwszego postu na blogu, obejmujące szeroki zakres tematów i mające na celu zaangażowanie czytelników od początku do końca.</p>',
    ' \
<h1>Wprowadzenie</h1>\
<p>Witamy w naszym pierwszym poście na blogu! W tym artykule zbadamy różne aspekty nowoczesnego tworzenia stron internetowych...</p>\
<h2>Sekcja 1: Zrozumienie Podstaw</h2>\
<p>Zanim przejdziemy do zaawansowanych tematów, omówmy kilka podstawowych koncepcji...</p>\
',
    false
  ),
  (
    'drugi-post',
    'Drugi Post na Blogu: Dogłębne Zanurzenie w Next.js',
    '/images/case-studies/gsense/gsense.avif',
    'Drugi Post na Blogu',
    '<p><em>Fragment:</em> Szczegółowa eksploracja funkcji Next.js i najlepszych praktyk dotyczących budowania nowoczesnych aplikacji internetowych.</p>',
    ' \
<p>W tym poście zagłębiamy się w zaawansowane funkcje Next.js, w tym renderowanie po stronie serwera, generowanie statycznych stron i trasy API...</p>\
<img src="/images/case-studies/gsense/gsense.avif" alt="Next.js" />',
    false
  ),
  (
    'trzeci-post',
    'Trzeci Post na Blogu: Przyszłość Tworzenia Stron Internetowych',
    '/images/case-studies/gsense/gsense.avif',
    'Trzeci Post na Blogu',
    '<p><em>Fragment:</em> Przegląd pojawiających się trendów i technologii, które kształtują przyszłość tworzenia stron internetowych.</p>',
    ' \
<p>Ten post bada najnowsze trendy w tworzeniu stron internetowych, takie jak WebAssembly, przetwarzanie bezserwerowe i progresywne aplikacje internetowe...</p>\
<img src="/images/case-studies/gsense/gsense.avif" alt="Trendy w Tworzeniu Stron Internetowych" />',
    false
  );