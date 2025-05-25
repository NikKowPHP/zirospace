/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('zirospace_hero_en', (table) => {
      table.text('id').primary(); // We will provide a fixed ID in the seed
      table.text('title').notNullable();
      table.text('subtitle').notNullable();
      table.text('background_image');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('zirospace_hero_pl', (table) => {
      table.text('id').primary(); // We will provide a fixed ID in the seed
      table.text('title').notNullable();
      table.text('subtitle').notNullable();
      table.text('background_image');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('zirospace_hero_en')
    .dropTableIfExists('zirospace_hero_pl');
};
