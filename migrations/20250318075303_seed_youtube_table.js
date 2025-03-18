/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex('youtube').insert([
    { 
      id: knex.raw('(lower(hex(randomblob(16))))'),
      youtube_url: 'dQw4w9WgXcQ' 
    } // Example YouTube URL
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex('youtube').where('youtube_url', 'dQw4w9WgXcQ').del();
};
