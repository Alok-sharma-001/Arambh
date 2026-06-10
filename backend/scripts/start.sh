#!/bin/bash
set -e

echo "--- ARAMBH STARTUP SCRIPT ---"

# Masked DATABASE_URL for logging
if [ -n "$DATABASE_URL" ]; then
  DB_HOST=$(echo "$DATABASE_URL" | sed 's/.*@//')
  echo "Target Database Host: $DB_HOST"
else
  echo "WARNING: DATABASE_URL is not set!"
fi

echo "Attempting to run Alembic migrations..."
if alembic upgrade head; then
  echo "Alembic migrations completed successfully."
else
  echo "Alembic migrations failed! This might be okay if Base.metadata.create_all handles it."
fi

echo "Starting FastAPI server with Uvicorn..."
# Using --preload might help ensure initialization code runs once in some uvicorn setups,
# but for now we stick to standard uvicorn call.
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
