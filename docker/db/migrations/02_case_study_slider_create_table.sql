CREATE TABLE case_study_sliders (
    id VARCHAR(255) PRIMARY KEY,
    theme VARCHAR(255),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE case_study_slider_images (
    id VARCHAR(255) PRIMARY KEY,
    slider_id VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    alt VARCHAR(255)
);

INSERT INTO case_study_sliders (id, theme) VALUES ('example-slider-en-1', 'light');

INSERT INTO case_study_slider_images (id, slider_id, image, alt) VALUES
('example-slider-image-en-1', 'example-slider-en-1', 'https://i.postimg.cc/3xwHPQmr/hf-01.png', 'hf 01'),
('example-slider-image-en-2', 'example-slider-en-1', 'https://i.postimg.cc/jdtT47j7/hf-02.png', 'hf 02'),
('example-slider-image-en-3', 'example-slider-en-1', 'https://i.postimg.cc/dt6YHV7S/hf-03.png', 'hf 03'),
('example-slider-image-en-4', 'example-slider-en-1', 'https://i.postimg.cc/SQWq9rm4/hf-04.png', 'hf 04'),
('example-slider-image-en-5', 'example-slider-en-1', 'https://i.postimg.cc/BnwG37BT/hf-05.png', 'hf 05');