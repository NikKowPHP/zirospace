/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('zirospace_banners_en', (table) => {
    table.text('id').primary();
    table.text('title').notNullable();
    table.text('content').notNullable();
    table.text('subtitle');
    table.text('image_url');
    table.timestamp('start_date', { useTz: true });
    table.timestamp('end_date', { useTz: true });
    table.boolean('is_active').notNullable().defaultTo(false);
    table.text('cta_button_text');
    table.text('cta_button_link');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('zirospace_banners_pl', (table) => {
    table.text('id').primary();
    table.text('title').notNullable();
    table.text('content').notNullable();
    table.text('subtitle');
    table.text('image_url');
    table.timestamp('start_date', { useTz: true });
    table.timestamp('end_date', { useTz: true });
    table.boolean('is_active').notNullable().defaultTo(false);
    table.text('cta_button_text');
    table.text('cta_button_link');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('zirospace_banners_en');
  await knex.schema.dropTableIfExists('zirospace_banners_pl');
};
