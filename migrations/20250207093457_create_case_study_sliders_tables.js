exports.up = function(knex) {
  return knex.schema
    .createTable('case_study_sliders', (table) => {
      table.string('id').primary();
      table.string('theme');
      table.text('created_at').defaultTo(knex.fn.now());
      table.text('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('case_study_slider_images', (table) => {
      table.string('id').primary();
      table.string('slider_id').notNullable();
      table.string('image');
      table.string('alt');
      table.foreign('slider_id').references('case_study_sliders.id'); // Add foreign key constraint
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('case_study_slider_images')  // Drop this table first due to the foreign key
    .dropTableIfExists('case_study_sliders');
};