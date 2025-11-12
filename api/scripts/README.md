# API Scripts

This directory contains utility scripts for the RayAI Platform API.

## Database Reset (`db_reset.sh`)

Resets the Supabase database and regenerates Pydantic types from the schema.

### Usage

```bash
# From the api/ directory
make db-reset

# Or run directly
bash scripts/db_reset.sh
```

### What it does

1. **Resets the database** - Runs `supabase db reset` to:
   - Apply all migrations from `supabase/migrations/`
   - Run seed data from `supabase/seed.sql`
   - Create test user with ID `00000000-0000-0000-0000-000000000001`

2. **Generates types** - Auto-generates Pydantic models from the Supabase schema to:
   - `app/database/generated_types.py`
   - Includes: `Profile`, `Sandbox`, `SandboxStatus` enum

### Requirements

- Supabase CLI installed: `brew install supabase/tap/supabase`
- Environment variables set in `.env`:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
- Python package installed: `uv add supabase-pydantic`

## Type Generation (`generate_types.py`)

Generates Pydantic models from Supabase schema without resetting the database.

### Usage

```bash
# From the api/ directory
make gen-types

# Or run directly
uv run python scripts/generate_types.py
```

### Generated Types

The script creates `app/database/generated_types.py` with:

```python
from app.database.generated_types import (
    Profile,      # User profile model
    Sandbox,      # Sandbox model
    SandboxStatus # Enum: stopped | active
)
```

## Development Workflow

### Initial Setup

```bash
# 1. Install dependencies
make install

# 2. Reset database and generate types
make db-reset

# 3. Start dev server
make dev
```

### After Schema Changes

Whenever you modify the database schema (add migrations, change tables):

```bash
# Reset database and regenerate types
make db-reset
```

### Type Generation Only

If you only need to regenerate types (no schema changes):

```bash
make gen-types
```

## Test User

The seed data creates a test user that matches the stub authentication:

- **User ID**: `00000000-0000-0000-0000-000000000001`
- **Email**: `test@example.com`
- **Name**: Test User

This allows you to test the API without real authentication.

## Troubleshooting

### "Supabase CLI not found"

Install it:
```bash
brew install supabase/tap/supabase
```

### "supabase-pydantic not installed"

Install it:
```bash
uv add supabase-pydantic
```

### Permission denied

Make the script executable:
```bash
chmod +x scripts/db_reset.sh
```
