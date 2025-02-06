CREATE TABLE public.testimonials_en (
    id VARCHAR(255) PRIMARY KEY,
    author VARCHAR(255),
    role VARCHAR(255),
    company VARCHAR(255),
    quote TEXT,
    image VARCHAR(255),
    image_alt VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.testimonials_pl (
    id VARCHAR(255) PRIMARY KEY,
    author VARCHAR(255),
    role VARCHAR(255),
    company VARCHAR(255),
    quote TEXT,
    image VARCHAR(255),
    image_alt VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);