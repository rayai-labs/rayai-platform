#!/usr/bin/env python3
"""Generate Pydantic types from Supabase schema using supabase-pydantic CLI.

This script wraps the sb-pydantic CLI command to generate Pydantic models.
"""

import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ Error: DATABASE_URL must be set in .env")
    print("   Example: postgresql://postgres:password@localhost:54322/postgres")
    sys.exit(1)

# Output path
output_path = Path(__file__).parent.parent / "app" / "database" / "generated_types.py"
output_path.parent.mkdir(parents=True, exist_ok=True)

print(f"🔗 Connecting to database...")
print(f"📝 Generating types to: {output_path}")

try:
    # Run sb-pydantic CLI command
    result = subprocess.run(
        [
            "uv", "run", "sb-pydantic", "gen",
            "--type", "pydantic",
            "--framework", "fastapi",
            "--db-url", DATABASE_URL,
            "--schema", "public",
            "--output", str(output_path),
        ],
        capture_output=True,
        text=True,
        check=True
    )

    print("✅ Types generated successfully!")
    print(f"\n📄 Generated file: {output_path}")
    print("\nImport in your code:")
    print("  from app.database.generated_types import Profile, Sandbox")

    if result.stdout:
        print("\nCLI Output:")
        print(result.stdout)

except subprocess.CalledProcessError as e:
    print(f"❌ Error generating types: {e}")
    if e.stdout:
        print("\nStdout:")
        print(e.stdout)
    if e.stderr:
        print("\nStderr:")
        print(e.stderr)
    sys.exit(1)
except FileNotFoundError:
    print("❌ Error: sb-pydantic command not found")
    print("   Make sure supabase-pydantic is installed: uv sync")
    sys.exit(1)
