// migrations/YYYYMMDDHHMMSS_create_testimonials_tables.js
exports.up = function(knex) {
  return knex.schema
    .createTable('testimonials_en', (table) => {
      table.string('id').primary();
      table.string('author');
      table.string('role');
      table.string('company');
      table.text('quote');
      table.string('image');
      table.string('image_alt');
      table.text('created_at').defaultTo(knex.fn.now());
      table.text('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('testimonials_pl', (table) => {
      table.string('id').primary();
      table.string('author');
      table.string('role');
      table.string('company');
      table.text('quote');
      table.string('image');
      table.string('image_alt');
      table.text('created_at').defaultTo(knex.fn.now());
      table.text('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('testimonials_en')
    .dropTableIfExists('testimonials_pl');
};