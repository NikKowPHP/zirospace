exports.up = function(knex) {
  return knex.schema
    .createTable('case_studies_en', (table) => {
      table.string('id').primary();
      table.string('slug').unique().notNullable();
      table.string('title').notNullable();
      table.string('subtitle');
      table.text('description');
      table.text('tags');  // Store as comma-separated string
      table.text('images'); // Store JSON as string
      table.string('cta_text');
      table.string('cta_text_name');
      table.string('cta_url');
      table.text('created_at').defaultTo(knex.fn.now()); // Use knex.fn.now() for current timestamp
      table.text('updated_at').defaultTo(knex.fn.now());
      table.string('color', 7);
      table.string('background_color', 7);
      table.string('theme', 50);
      table.integer('order_index').defaultTo(0);
    })
    .createTable('case_studies_pl', (table) => {
      table.string('id').primary();
      table.string('slug').unique().notNullable();
      table.string('title').notNullable();
      table.string('subtitle');
      table.text('description');
      table.text('tags');  // Store as comma-separated string
      table.text('images'); // Store JSON as string
      table.string('cta_text');
      table.string('cta_text_name');
      table.string('cta_url');
      table.text('created_at').defaultTo(knex.fn.now()); // Use knex.fn.now()
      table.text('updated_at').defaultTo(knex.fn.now());
      table.string('color', 7);
      table.string('background_color', 7);
      table.string('theme', 50);
      table.integer('order_index').defaultTo(0);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('case_studies_en')
    .dropTableIfExists('case_studies_pl');
};