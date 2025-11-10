#!/bin/bash
set -e

# Database Reset Script with Type Generation
# This script resets the Supabase database and regenerates Python types

echo "🔄 Starting database reset..."

# Check if we're in the right directory
if [ ! -f "pyproject.toml" ]; then
    echo "❌ Error: Must run from api/ directory"
    exit 1
fi

# Check for required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo "⚠️  Loading environment variables from .env"
    if [ -f ".env" ]; then
        export $(cat .env | grep -v '^#' | xargs)
    else
        echo "❌ Error: .env file not found"
        exit 1
    fi
fi

# Step 1: Reset Supabase database (if using local Supabase)
echo ""
echo "📦 Resetting Supabase database..."
if command -v supabase &> /dev/null; then
    cd ..
    supabase db reset
    cd api
    echo "✓ Database reset complete"
else
    echo "⚠️  Supabase CLI not found. Skipping database reset."
    echo "   To reset the database, run: cd .. && supabase db reset"
fi

# Step 2: Generate types from Supabase schema
echo ""
echo "🔧 Generating Pydantic types from Supabase schema..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Skipping type generation."
    echo "   Set DATABASE_URL in .env to enable type generation."
else
    # Run the type generation script
    if uv run python scripts/generate_types.py; then
        echo "✓ Types generated successfully"
    else
        echo "⚠️  Type generation failed. Continuing anyway..."
    fi
fi

echo ""
echo "✅ Database reset complete!"
echo ""
echo "Next steps:"
echo "  1. Start the API server: make dev"
echo "  2. Test the endpoints: curl http://localhost:8000/api/v1/sandboxes"
