CREATE TABLE case_studies_en (
    id VARCHAR(255) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    tags TEXT, -- Changed from TEXT[] to TEXT, will store comma-separated tags
    images TEXT, -- Changed from JSONB[] to TEXT, will store JSON array as string
    cta_text VARCHAR(255),
    cta_text_name VARCHAR(255),
    cta_url VARCHAR(255),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP, -- Changed from TIMESTAMP WITH TIME ZONE to TEXT DEFAULT CURRENT_TIMESTAMP
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP, -- Changed from TIMESTAMP WITH TIME ZONE to TEXT DEFAULT CURRENT_TIMESTAMP
    color VARCHAR(7),
    background_color VARCHAR(7),
    theme VARCHAR(50),
    order_index INTEGER DEFAULT 0
);

CREATE TABLE case_studies_pl (
    id VARCHAR(255) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    tags TEXT, -- Changed from TEXT[] to TEXT, will store comma-separated tags
    images TEXT, -- Changed from JSONB[] to TEXT, will store JSON array as string
    cta_text VARCHAR(255),
    cta_text_name VARCHAR(255),
    cta_url VARCHAR(255),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP, -- Changed from TIMESTAMP WITH TIME ZONE to TEXT DEFAULT CURRENT_TIMESTAMP
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP, -- Changed from TIMESTAMP WITH TIME ZONE to TEXT DEFAULT CURRENT_TIMESTAMP
    color VARCHAR(7),
    background_color VARCHAR(7),
    theme VARCHAR(50),
    order_index INTEGER DEFAULT 0
);

INSERT INTO case_studies_en (
    id, slug, title, subtitle, description, tags, images, cta_text, cta_text_name, cta_url, color, background_color, theme, order_index
) VALUES (
    'example-case-study-en-1',
    'example-case-study-en-1',
    'Example Case Study EN 1',
    'Example Subtitle EN 1',
    'Example Description EN 1',
    'tag1,tag2', -- Comma-separated tags
    '[{"alt": "simple", "url": "https://example.com/image.png"}]', -- JSON array as string
    'Learn More',
    'caseStudy.ctaText.viewCaseStudy',
    '/case-studies/example-case-study-en-1',
    '#FFFFFF',
    '#F0F0F0',
    'default',
    0
);

INSERT INTO case_studies_pl (
    id, slug, title, subtitle, description, tags, images, cta_text, cta_text_name, cta_url, color, background_color, theme, order_index
) VALUES (
    'example-case-study-pl-1',
    'example-case-study-pl-1',
    'Example Case Study PL 1',
    'Example Subtitle PL 1',
    'Example Description PL 1',
    'tag1,tag2', -- Comma-separated tags
    '[{"alt": "simple", "url": "https://example.com/image.png"}]', -- JSON array as string
    'Dowiedz się więcej',
    'caseStudy.ctaText.viewCaseStudy',
    '/pl/case-studies/example-case-study-pl-1',
    '#FFFFFF',
    '#F0F0F0',
    'default',
    0
);