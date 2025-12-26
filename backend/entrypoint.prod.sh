#!/bin/bash
set -e

echo "📦 Running database migrations..."
# Check if DATABASE_URL is set, otherwise migrations might fail or use default
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  WARNING: DATABASE_URL is not set. Migrations might fail if not configured elsewhere."
fi

alembic upgrade head
echo "✅ Migrations applied."

echo "🚀 Starting Uvicorn server..."
# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
