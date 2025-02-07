#!/bin/bash
set -e



# Wait for PostgreSQL to start (self-check)
until PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - waiting..."
  sleep 1
done

>&2 echo "PostgreSQL is up - running migrations"

# Execute all SQL files in the migrations directory
for f in /docker-entrypoint-initdb.d/migrations/*.sql; do
  >&2 echo "Executing migration: $f"
  PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$f"
done

>&2 echo "Migrations finished"

# Start the main application (if needed, e.g., if you have a node server to start here)
# For Next.js in Docker, you might not need to start anything here, as the web service is built separately.
# If you have other initialization tasks, add them below.

echo "Entrypoint script finished."