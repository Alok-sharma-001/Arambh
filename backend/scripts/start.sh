#!/bin/bash
set -e

echo "--- STARTUP SCRIPT STARTING ---"

# Masked DATABASE_URL for logging
if [ -n "$DATABASE_URL" ]; then
  DB_HOST=$(echo "$DATABASE_URL" | sed 's/.*@//')
  echo "Target Database Host: $DB_HOST"
else
  echo "DATABASE_URL is not set!"
fi

echo "Running Alembic migrations..."
if alembic upgrade head; then
  echo "Alembic migrations completed successfully."
else
  echo "Alembic migrations failed! Continuing to app startup (will attempt Base.metadata.create_all)..."
fi

echo "Starting FastAPI server with Uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
