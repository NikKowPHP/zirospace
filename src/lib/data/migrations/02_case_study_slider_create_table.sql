CREATE TABLE public.case_study_sliders_en (
    id VARCHAR(255) PRIMARY KEY,
    theme VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.case_study_slider_images_en (
    id VARCHAR(255) PRIMARY KEY,
    slider_id VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    alt VARCHAR(255),
    FOREIGN KEY (slider_id) REFERENCES public.case_study_sliders_en(id) ON DELETE CASCADE
);