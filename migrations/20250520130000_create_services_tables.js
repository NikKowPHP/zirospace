/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('services_en', (table) => {
      table.text('id').primary();
      table.text('slug').unique().notNullable();
      table.text('title').notNullable();
      table.text('subtitle');
      table.text('content_html');
      table.text('excerpt');
      table.text('image_url');
      table.text('image_alt');
      table.text('meta_title');
      table.text('meta_description');
      table.text('keywords');
      table.boolean('is_published').defaultTo(true);
      table.integer('order_index').defaultTo(0);
      table.text('created_at');
      table.text('updated_at');
    })
    .createTable('services_pl', (table) => {
      table.text('id').primary();
      table.text('slug').unique().notNullable();
      table.text('title').notNullable();
      table.text('subtitle');
      table.text('content_html');
      table.text('excerpt');
      table.text('image_url');
      table.text('image_alt');
      table.text('meta_title');
      table.text('meta_description');
      table.text('keywords');
      table.boolean('is_published').defaultTo(true);
      table.integer('order_index').defaultTo(0);
      table.text('created_at');
      table.text('updated_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('services_en')
    .dropTableIfExists('services_pl');
};