/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
// migrations/YYYYMMDDHHMMSS_seed_testimonials_tables.js

exports.up = async function(knex) {
  await knex('testimonials_en').insert([
    {
      id: 'testimonial-en-1',
      author: 'John Doe',
      role: 'Software Engineer',
      company: 'Acme Corp',
      quote: 'This is an example testimonial in English.',
      image: '/images/testimonials/testimonial.webp',
      image_alt: 'John Doe'
    },
    {
      id: 'testimonial-en-2',
      author: 'Jane Smith',
      role: 'Product Manager',
      company: 'Beta Inc',
      quote: 'sadasdas dsad asd asd asd a fyuck you .',
      image: '/images/testimonials/testimonial.webp',
      image_alt: 'Jane Smith'
    },
    {
      id: 'testimonial-en-3',
      author: 'Mike Johnson',
      role: 'Data Scientist',
      company: 'Gamma Ltd',
      quote: 'I found this service incredibly useful for my data analysis needs.',
      image: '/images/testimonials/testimonial.webp',
      image_alt: 'Mike Johnson'
    },
    {
      id: 'testimonial-en-4',
      author: 'Emily White',
      role: 'UX Designer',
      company: 'Delta Co',
      quote: 'The user experience is top-notch, making my design process smoother.',
      image: '/images/testimonials/testimonial.webp',
      image_alt: 'Emily White'
    },
    {
      id: 'testimonial-en-5',
      author: 'David Brown',
      role: 'CEO',
      company: 'Epsilon Inc',
      quote: 'Our company has seen significant improvements since using this product.',
      image: '/images/testimonials/testimonial.webp',
      image_alt: 'David Brown'
    }
  ]);

  await knex('testimonials_pl').insert([
    {
      id: 'testimonial-pl-1',
      author: 'Jan Kowalski',
      role: 'Inżynier Oprogramowania',
      company: 'Gamma Sp. z o.o.',
      quote: 'To jest przykładowa opinia po polsku.',
      image: '/images/testimonials/testimonial.webp',
      image_alt: 'Jan Kowalski'
    },
    {
      id: 'testimonial-pl-2',
      author: 'Anna Nowak',
      role: 'Menadżer Produktu',
      company: 'Delta S.A.',
      quote: 'Kolejna inspirująca opinia po polsku.',
      image: '/images/testimonials/testimonial.webp',
      image_alt: 'Anna Nowak'
    },
    {
      id: 'testimonial-pl-3',
      author: 'Piotr Zieliński',
      role: 'Naukowiec Danych',
      company: 'Omega Sp. z o.o.',
      quote: 'Usługa ta okazała się niezwykle przydatna w moich analizach danych.',
      image: '/images/testimonials/testimonial.webp',
      image_alt: 'Piotr Zieliński'
    },
    {
      id: 'testimonial-pl-4',
      author: 'Maria Lewandowska',
      role: 'Projektant UX',
      company: 'Sigma S.A.',
      quote: 'Doświadczenie użytkownika jest na najwyższym poziomie, co usprawnia mój proces projektowania.',
      image: '/images/testimonials/testimonial.webp',
      image_alt: 'Maria Lewandowska'
    },
    {
      id: 'testimonial-pl-5',
      author: 'Tomasz Dąbrowski',
      role: 'Dyrektor Generalny',
      company: 'Alfa Sp. z o.o.',
      quote: 'Nasza firma odnotowała znaczne ulepszenia od czasu wprowadzenia tego produktu.',
      image: '/images/testimonials/testimonial.webp',
      image_alt: 'Tomasz Dąbrowski'
    }
  ]);
};

exports.down = async function(knex) {
  await knex('testimonials_en').whereIn('id', ['testimonial-en-1', 'testimonial-en-2', 'testimonial-en-3', 'testimonial-en-4', 'testimonial-en-5']).del();
  await knex('testimonials_pl').whereIn('id', ['testimonial-pl-1', 'testimonial-pl-2', 'testimonial-pl-3', 'testimonial-pl-4', 'testimonial-pl-5']).del();
};