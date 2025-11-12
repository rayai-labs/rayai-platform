"""Database adapter - main entry point."""

from app.database.adapter.pool import ConnectionPool
from app.database.adapter.sandbox import SandboxResource
from app.database.adapter.profile import ProfileResource
from app.database.adapter.api_key import APIKeyResource


class Database:
    """Main database adapter with resource access.

    Usage:
        from app.database import database

        # Async
        sandbox = await database.Sandbox.create(user_id=uuid)

        # Sync
        sandbox = database.Sandbox.create_sync(user_id=uuid)

        # Transactions
        async with database.async_transaction() as conn:
            sandbox = await database.Sandbox.create(user_id=uuid, conn=conn)
    """

    def __init__(self, pool: ConnectionPool):
        """Initialize database adapter.

        Args:
            pool: Connection pool instance
        """
        self._pool = pool
        self.Sandbox = SandboxResource(pool)
        self.Profile = ProfileResource(pool)
        self.APIKey = APIKeyResource(pool)

    def transaction(self):
        """Get sync connection for transaction.

        Usage:
            with database.transaction() as conn:
                sandbox = database.Sandbox.create_sync(user_id=uuid, conn=conn)
        """
        return self._pool.connection()

    def async_transaction(self):
        """Get async connection for transaction.

        Usage:
            async with database.async_transaction() as conn:
                sandbox = await database.Sandbox.create(user_id=uuid, conn=conn)
        """
        return self._pool.async_connection()

    async def close(self):
        """Close all database connections."""
        await self._pool.close()


__all__ = ["Database"]
