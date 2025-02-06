#!/bin/bash
set -e

# Wait for PostgreSQL to start
until PGPASSWORD="$POSTGRES_PASSWORD" psql -h "db" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - waiting..."
  sleep 1
done

>&2 echo "PostgreSQL is up - running migrations"

# Function to execute SQL files
execute_sql_file() {
  >&2 echo "Executing SQL file: $1"
  PGPASSWORD="$POSTGRES_PASSWORD" psql -h "db" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "/docker-entrypoint-initdb.d/$1"
  >&2 echo "SQL file executed: $1"
}

# Execute migration files in order
execute_sql_file "logs_create_table.sql"
execute_sql_file "case_studies_create_table.sql"
execute_sql_file "case_studies_en_rows.sql"
execute_sql_file "case_study_sliders_create_table.sql"

>&2 echo "Migrations finished"

# Start the main application (if needed, e.g., if you have a node server to start here)
# For Next.js in Docker, you might not need to start anything here, as the web service is built separately.
# If you have other initialization tasks, add them below.

echo "Entrypoint script finished."