/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // ... existing code ...
  return knex.schema.createTable('blog_posts_en', (table) => {
    table.increments('id').primary();
    table.string('slug').notNullable().unique();
    table.string('title').notNullable();
    table.string('image_url').notNullable();
    table.string('image_alt');
    table.text('excerpt').notNullable();
    table.text('content_html').notNullable();
    table.timestamps(true, true);
  })
  .createTable('blog_posts_pl', (table) => {
    table.increments('id').primary();
    table.string('slug').notNullable().unique();
    table.string('title').notNullable();
    table.string('image_url').notNullable();
    table.string('image_alt');
    table.text('excerpt').notNullable();
    table.text('content_html').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // ... existing code ...
  return knex.schema.dropTableIfExists('blog_posts_en')
  .dropTableIfExists('blog_posts_pl');
};