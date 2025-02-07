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
      image: 'https://i.postimg.cc/T1nrzdwP/BCJ9upw-V2-ARbexiidm-P5w0okz-LE.avif',
      image_alt: 'John Doe'
    },
    {
      id: 'testimonial-en-2',
      author: 'Jane Smith',
      role: 'Product Manager',
      company: 'Beta Inc',
      quote: 'Another inspiring testimonial in English.',
      image: 'https://i.postimg.cc/T1nrzdwP/BCJ9upw-V2-ARbexiidm-P5w0okz-LE.avif',
      image_alt: 'Jane Smith'
    }
  ]);

  await knex('testimonials_pl').insert([
    {
      id: 'testimonial-pl-1',
      author: 'Jan Kowalski',
      role: 'Inżynier Oprogramowania',
      company: 'Gamma Sp. z o.o.',
      quote: 'To jest przykładowa opinia po polsku.',
      image: 'https://i.postimg.cc/T1nrzdwP/BCJ9upw-V2-ARbexiidm-P5w0okz-LE.avif',
      image_alt: 'Jan Kowalski'
    },
    {
      id: 'testimonial-pl-2',
      author: 'Anna Nowak',
      role: 'Menadżer Produktu',
      company: 'Delta S.A.',
      quote: 'Kolejna inspirująca opinia po polsku.',
      image: 'https://i.postimg.cc/T1nrzdwP/BCJ9upw-V2-ARbexiidm-P5w0okz-LE.avif',
      image_alt: 'Anna Nowak'
    }
  ]);
};

exports.down = async function(knex) {
  await knex('testimonials_en').whereIn('id', ['testimonial-en-1', 'testimonial-en-2']).del();
  await knex('testimonials_pl').whereIn('id', ['testimonial-pl-1', 'testimonial-pl-2']).del();
};