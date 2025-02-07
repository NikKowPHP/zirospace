/**
 * Update with your config settings.
 *
 * @type { import("knex").Knex.Config }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/lib/data/sql/sqlite.db' // Path to your sqlite.db file
    },
    migrations: {
      directory: './docker/db/migrations' // Path to your migrations directory
    },
    useNullAsDefault: true // Required for SQLite to prevent errors with default values
  },

  // You can add configurations for other environments (staging, production) here if needed
};