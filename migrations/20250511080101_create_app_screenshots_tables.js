exports.up = function(knex) {
  return knex.schema
    .createTable('apps', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.string('thumbnail_url');
      table.float('average_rating').defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable('screenshots', function (table) {
      table.increments('id').primary();
      table.integer('app_id').unsigned().notNullable().references('id').inTable('apps').onDelete('CASCADE');
      table.string('image_url').notNullable();
      table.string('screen_name');
      table.string('route_path');
      table.text('description');
      table.integer('order_index').defaultTo(0);
      table.float('average_rating').defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable('app_ratings', function (table) {
      table.increments('id').primary();
      table.integer('app_id').unsigned().notNullable().references('id').inTable('apps').onDelete('CASCADE');
      table.string('user_id'); // Nullable for anonymous ratings
      table.integer('rating_value').notNullable();
      table.timestamps(true, true);
    })
    .createTable('screenshot_ratings', function (table) {
      table.increments('id').primary();
      table.integer('screenshot_id').unsigned().notNullable().references('id').inTable('screenshots').onDelete('CASCADE');
      table.string('user_id'); // Nullable for anonymous ratings
      table.integer('rating_value').notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('screenshot_ratings')
    .dropTable('app_ratings')
    .dropTable('screenshots')
    .dropTable('apps');
};
