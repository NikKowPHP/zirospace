exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('updates_en', (table) => {
      table.text('id').primary();
      table.text('slug').unique().notNullable();
      table.text('title').notNullable();
      table.timestamp('publish_date', { useTz: true }).notNullable();
      table.text('content_html');
      table.text('excerpt');
      table.text('image_url');
      table.text('image_alt');
      table.boolean('is_published').defaultTo(false);
      table.integer('order_index').defaultTo(0);
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('updates_pl', (table) => {
      table.text('id').primary();
      table.text('slug').unique().notNullable();
      table.text('title').notNullable();
      table.timestamp('publish_date', { useTz: true }).notNullable();
      table.text('content_html');
      table.text('excerpt');
      table.text('image_url');
      table.text('image_alt');
      table.boolean('is_published').defaultTo(false);
      table.integer('order_index').defaultTo(0);
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('updates_en'),
    knex.schema.dropTable('updates_pl')
  ]);
};