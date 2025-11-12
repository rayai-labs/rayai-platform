"""Database adapter and models.

This module exports the main database adapter singleton and database models.

Usage:
    from app.database import database, Sandbox, SandboxStatus

    # Async operations
    sandbox = await database.Sandbox.create(user_id=uuid, status=SandboxStatus.ACTIVE)
    sandboxes = await database.Sandbox.get_by_user(user_id=uuid)

    # Sync operations
    sandbox = database.Sandbox.create_sync(user_id=uuid)

    # Transactions
    async with database.async_transaction() as conn:
        sandbox = await database.Sandbox.create(user_id=uuid, conn=conn)
        api_key = await database.APIKey.create(user_id=uuid, name="key", conn=conn)
"""

from app.config import settings
from app.database.adapter import Database
from app.database.adapter.pool import ConnectionPool
from app.database.generated.models import (
    ApiKey,
    Profile,
    Sandbox,
    SandboxStatus,
)

# Create connection pool and database singleton
_pool = ConnectionPool(settings.database_url)
database = Database(_pool)

__all__ = [
    "database",
    "Sandbox",
    "Profile",
    "ApiKey",
    "SandboxStatus",
]
