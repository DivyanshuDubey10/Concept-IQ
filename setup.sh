#!/usr/bin/env bash
# ==============================================================================
# Concept-IQ Local Setup Script
# Run this script to instantly boot the backend, database, and seed MVP data.
# ==============================================================================

set -e # Exit on any error

echo "🚀 Starting Concept-IQ Local Setup..."

# 1. Start PostgreSQL via Docker Compose
echo "📦 Starting PostgreSQL database..."
docker-compose up -d db

# Wait for DB to be ready
echo "⏳ Waiting for database to initialize..."
sleep 3

# 2. Setup Python Virtual Environment
echo "🐍 Setting up Python virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate

# 3. Install Requirements
echo "📥 Installing backend dependencies..."
pip install -r backend/requirements.txt

# 4. Run Migrations
echo "🏗️ Running database migrations..."
alembic -c backend/alembic.ini upgrade head

# 5. Seed Data
echo "🌱 Seeding database with MVP courses..."
python -m backend.app.seed.seed_data

# 6. Start Server
echo "✅ Setup complete! Starting FastAPI server on http://localhost:8000"
echo "Press Ctrl+C to stop the server."
uvicorn backend.app.main:app --reload --port 8000
