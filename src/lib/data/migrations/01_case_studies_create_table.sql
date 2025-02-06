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