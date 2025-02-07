CREATE TABLE public.case_studies_en (
    id VARCHAR(255) PRIMARY KEY, -- Assuming id is a string, adjust if needed
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    tags TEXT[], -- Array of strings for tags
    images JSONB[], -- Array of JSON objects for images, using JSONB for efficiency
    cta_text VARCHAR(255),
    cta_text_name VARCHAR(255),
    cta_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    color VARCHAR(7), -- Assuming hex color code, e.g., #FFFFFF
    background_color VARCHAR(7),
    theme VARCHAR(50),
    order_index INTEGER DEFAULT 0 -- Added order_index as in your INSERT statement
);
CREATE TABLE public.case_studies_pl (
    id VARCHAR(255) PRIMARY KEY, -- Assuming id is a string, adjust if needed
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    tags TEXT[], -- Array of strings for tags
    images JSONB[], -- Array of JSON objects for images, using JSONB for efficiency
    cta_text VARCHAR(255),
    cta_text_name VARCHAR(255),
    cta_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    color VARCHAR(7), -- Assuming hex color code, e.g., #FFFFFF
    background_color VARCHAR(7),
    theme VARCHAR(50),
    order_index INTEGER DEFAULT 0 -- Added order_index as in your INSERT statement
);

INSERT INTO public.case_studies_en (
    id, slug, title, subtitle, description, tags, images, cta_text, cta_text_name, cta_url, color, background_color, theme, order_index
) VALUES (
    'example-case-study-en-1',
    'example-case-study-en-1',
    'Example Case Study EN 1',
    'Example Subtitle EN 1',
    'Example Description EN 1',
    '{"tag1", "tag2"}',
    '{"alt": "simple", "url": "https://example.com/image.png"}'::jsonb,
    'Learn More',
    'caseStudy.ctaText.viewCaseStudy',
    '/case-studies/example-case-study-en-1',
    '#FFFFFF',
    '#F0F0F0',
    'default',
    0
);

INSERT INTO public.case_studies_pl (
    id, slug, title, subtitle, description, tags, images, cta_text, cta_text_name, cta_url, color, background_color, theme, order_index
) VALUES (
    'example-case-study-pl-1',
    'example-case-study-pl-1',
    'Example Case Study PL 1',
    'Example Subtitle PL 1',
    'Example Description PL 1',
    '{"tag1", "tag2"}',
    '{"alt": "simple", "url": "https://example.com/image.png"}'::jsonb,
    'Dowiedz się więcej',
    'caseStudy.ctaText.viewCaseStudy',
    '/pl/case-studies/example-case-study-pl-1',
    '#FFFFFF',
    '#F0F0F0',
    'default',
    0
);