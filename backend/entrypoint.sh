#!/bin/bash
set -e

# Wait for database (optional, but good practice if relying on startup.py logic isn't enough)
# python startup.py --check-only  <-- We could add a check mode, but let's stick to simple first.

echo "🚀 Starting deployment tasks..."

# 1. Initialize Tables (Alembic)
echo "📦 Running Migrations..."
python init_db.py

# 2. Seed Data (Idempotent)
echo "🌱 Seeding Data..."
python seed_clubs.py

# 3. Start Server
echo "✅ Starting Uvicorn Server..."
# We use 'exec' so uvicorn becomes PID 1 (receives signals correctly)
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
