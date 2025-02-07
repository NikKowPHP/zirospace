CREATE TABLE testimonials_en (
    id VARCHAR(255) PRIMARY KEY,
    author VARCHAR(255),
    role VARCHAR(255),
    company VARCHAR(255),
    quote TEXT,
    image VARCHAR(255),
    image_alt VARCHAR(255),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testimonials_pl (
    id VARCHAR(255) PRIMARY KEY,
    author VARCHAR(255),
    role VARCHAR(255),
    company VARCHAR(255),
    quote TEXT,
    image VARCHAR(255),
    image_alt VARCHAR(255),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO testimonials_en (
    id, author, role, company, quote, image, image_alt
) VALUES (
    'testimonial-en-1',
    'John Doe',
    'Software Engineer',
    'Acme Corp',
    'This is an example testimonial in English.',
    'https://i.postimg.cc/T1nrzdwP/BCJ9upw-V2-ARbexiidm-P5w0okz-LE.avif',
    'John Doe'
);

INSERT INTO testimonials_en (
    id, author, role, company, quote, image, image_alt
) VALUES (
    'testimonial-en-2',
    'Jane Smith',
    'Product Manager',
    'Beta Inc',
    'Another inspiring testimonial in English.',
    'https://i.postimg.cc/T1nrzdwP/BCJ9upw-V2-ARbexiidm-P5w0okz-LE.avif',
    'Jane Smith'
);

INSERT INTO testimonials_pl (
    id, author, role, company, quote, image, image_alt
) VALUES (
    'testimonial-pl-1',
    'Jan Kowalski',
    'Inżynier Oprogramowania',
    'Gamma Sp. z o.o.',
    'To jest przykładowa opinia po polsku.',
    'https://i.postimg.cc/T1nrzdwP/BCJ9upw-V2-ARbexiidm-P5w0okz-LE.avif',
    'Jan Kowalski'
);

INSERT INTO testimonials_pl (
    id, author, role, company, quote, image, image_alt
) VALUES (
    'testimonial-pl-2',
    'Anna Nowak',
    'Menadżer Produktu',
    'Delta S.A.',
    'Kolejna inspirująca opinia po polsku.',
    'https://i.postimg.cc/T1nrzdwP/BCJ9upw-V2-ARbexiidm-P5w0okz-LE.avif',
    'Anna Nowak'
);