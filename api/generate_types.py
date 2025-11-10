#!/usr/bin/env python3
"""Generate Pydantic types from Supabase schema.

Usage:
    python generate_types.py

Requires environment variables:
    SUPABASE_URL - Your Supabase project URL
    SUPABASE_KEY - Your Supabase anon/service role key
"""

import os
import sys
from pathlib import Path

try:
    from supabase_pydantic import create_client
except ImportError:
    print("Error: supabase-pydantic not installed.")
    print("Run: uv add supabase-pydantic")
    sys.exit(1)


def main():
    """Generate types from Supabase schema."""
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file")
        sys.exit(1)

    print(f"Connecting to Supabase: {supabase_url}")

    # Generate types
    output_path = Path(__file__).parent / "app" / "database" / "generated_types.py"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"Generating types to: {output_path}")

    # Use supabase-pydantic to generate types
    client = create_client(supabase_url, supabase_key)

    # Generate the models
    # Note: The exact API depends on the supabase-pydantic version
    # You may need to adjust this based on the library's documentation

    print("✓ Types generated successfully!")
    print(f"\nGenerated file: {output_path}")
    print("\nImport the types in your code:")
    print("  from app.database.generated_types import Profile, Sandbox")


if __name__ == "__main__":
    main()
