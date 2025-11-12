"""API Key resource wrapper for database operations."""

from typing import Optional
from uuid import UUID

from sqlalchemy import Connection
from sqlalchemy.ext.asyncio import AsyncConnection

from app.database.adapter.pool import ConnectionPool
from app.database.generated.models import ApiKey
from app.database.generated import api_keys as gen


class APIKeyResource:
    """Wrapper for API key database queries.

    Provides both sync and async methods for all API key operations.
    """

    def __init__(self, pool: ConnectionPool):
        """Initialize API key resource.

        Args:
            pool: Connection pool instance
        """
        self._pool = pool

    # Async methods

    async def create(
        self,
        *,
        user_id: UUID,
        name: str,
        key_hash: str,
        conn: Optional[AsyncConnection] = None,
    ) -> ApiKey:
        """Create a new API key (async).

        Args:
            user_id: UUID of the user who owns the key
            name: Human-readable name for the key
            key_hash: Hashed API key value
            conn: Optional explicit connection for transactions

        Returns:
            Created ApiKey model

        Example:
            api_key = await database.APIKey.create(
                user_id=user_id,
                name="Production Key",
                key_hash=hashed_key
            )
        """
        params = gen.CreateAPIKeyParams(
            user_id=user_id,
            name=name,
            key_hash=key_hash,
        )

        if conn:
            querier = gen.AsyncQuerier(conn)
            result = await querier.create_api_key(params)
            if not result:
                raise RuntimeError("Failed to create API key")
            return result

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            result = await querier.create_api_key(params)
            if not result:
                raise RuntimeError("Failed to create API key")
            return result

    async def get(
        self, *, id: UUID, conn: Optional[AsyncConnection] = None
    ) -> Optional[ApiKey]:
        """Get API key by ID (async).

        Args:
            id: API key UUID
            conn: Optional explicit connection for transactions

        Returns:
            ApiKey model if found, None otherwise
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.get_api_key(gen.GetAPIKeyParams(id=id))

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.get_api_key(gen.GetAPIKeyParams(id=id))

    async def get_by_user(
        self, *, user_id: UUID, conn: Optional[AsyncConnection] = None
    ) -> list[ApiKey]:
        """Get all API keys for a user (async).

        Args:
            user_id: User UUID
            conn: Optional explicit connection for transactions

        Returns:
            List of ApiKey models (empty if none found)
        """

        async def _query(conn: AsyncConnection) -> list[ApiKey]:
            querier = gen.AsyncQuerier(conn)
            return [
                k
                async for k in querier.get_api_keys_by_user(
                    gen.GetAPIKeysByUserParams(user_id=user_id)
                )
            ]

        if conn:
            return await _query(conn)

        async with self._pool.async_connection() as conn:
            return await _query(conn)

    async def get_by_hash(
        self, *, key_hash: str, conn: Optional[AsyncConnection] = None
    ) -> Optional[ApiKey]:
        """Get API key by hash (async).

        Used for authentication - looks up key by its hashed value.

        Args:
            key_hash: Hashed API key value
            conn: Optional explicit connection for transactions

        Returns:
            ApiKey model if found, None otherwise
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.get_api_key_by_hash(
                gen.GetAPIKeyByHashParams(key_hash=key_hash)
            )

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.get_api_key_by_hash(
                gen.GetAPIKeyByHashParams(key_hash=key_hash)
            )

    async def update_last_used(
        self, *, id: UUID, conn: Optional[AsyncConnection] = None
    ) -> Optional[ApiKey]:
        """Update API key's last used timestamp (async).

        Sets last_used_at to NOW(). Call this when the key is used for authentication.

        Args:
            id: API key UUID
            conn: Optional explicit connection for transactions

        Returns:
            Updated ApiKey model if found, None otherwise
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.update_api_key_last_used(
                gen.UpdateAPIKeyLastUsedParams(id=id)
            )

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.update_api_key_last_used(
                gen.UpdateAPIKeyLastUsedParams(id=id)
            )

    async def delete(
        self, *, id: UUID, conn: Optional[AsyncConnection] = None
    ) -> None:
        """Delete an API key (async).

        Args:
            id: API key UUID
            conn: Optional explicit connection for transactions
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            await querier.delete_api_key(gen.DeleteAPIKeyParams(id=id))
            return

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            await querier.delete_api_key(gen.DeleteAPIKeyParams(id=id))

    # Sync methods

    def create_sync(
        self,
        *,
        user_id: UUID,
        name: str,
        key_hash: str,
        conn: Optional[Connection] = None,
    ) -> ApiKey:
        """Create a new API key (sync)."""
        params = gen.CreateAPIKeyParams(
            user_id=user_id,
            name=name,
            key_hash=key_hash,
        )

        if conn:
            querier = gen.Querier(conn)
            result = querier.create_api_key(params)
            if not result:
                raise RuntimeError("Failed to create API key")
            return result

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            result = querier.create_api_key(params)
            if not result:
                raise RuntimeError("Failed to create API key")
            return result

    def get_sync(
        self, *, id: UUID, conn: Optional[Connection] = None
    ) -> Optional[ApiKey]:
        """Get API key by ID (sync)."""
        if conn:
            querier = gen.Querier(conn)
            return querier.get_api_key(gen.GetAPIKeyParams(id=id))

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            return querier.get_api_key(gen.GetAPIKeyParams(id=id))

    def get_by_user_sync(
        self, *, user_id: UUID, conn: Optional[Connection] = None
    ) -> list[ApiKey]:
        """Get all API keys for a user (sync)."""

        def _query(conn: Connection) -> list[ApiKey]:
            querier = gen.Querier(conn)
            return list(
                querier.get_api_keys_by_user(
                    gen.GetAPIKeysByUserParams(user_id=user_id)
                )
            )

        if conn:
            return _query(conn)

        with self._pool.connection() as conn:
            return _query(conn)

    def get_by_hash_sync(
        self, *, key_hash: str, conn: Optional[Connection] = None
    ) -> Optional[ApiKey]:
        """Get API key by hash (sync)."""
        if conn:
            querier = gen.Querier(conn)
            return querier.get_api_key_by_hash(
                gen.GetAPIKeyByHashParams(key_hash=key_hash)
            )

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            return querier.get_api_key_by_hash(
                gen.GetAPIKeyByHashParams(key_hash=key_hash)
            )

    def update_last_used_sync(
        self, *, id: UUID, conn: Optional[Connection] = None
    ) -> Optional[ApiKey]:
        """Update API key's last used timestamp (sync)."""
        if conn:
            querier = gen.Querier(conn)
            return querier.update_api_key_last_used(
                gen.UpdateAPIKeyLastUsedParams(id=id)
            )

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            return querier.update_api_key_last_used(
                gen.UpdateAPIKeyLastUsedParams(id=id)
            )

    def delete_sync(self, *, id: UUID, conn: Optional[Connection] = None) -> None:
        """Delete an API key (sync)."""
        if conn:
            querier = gen.Querier(conn)
            querier.delete_api_key(gen.DeleteAPIKeyParams(id=id))
            return

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            querier.delete_api_key(gen.DeleteAPIKeyParams(id=id))


__all__ = ["APIKeyResource"]
