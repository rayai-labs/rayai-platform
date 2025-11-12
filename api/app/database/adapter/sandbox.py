"""Sandbox resource wrapper for database operations."""

from typing import Optional
from uuid import UUID

from sqlalchemy import Connection
from sqlalchemy.ext.asyncio import AsyncConnection

from app.database.adapter.pool import ConnectionPool
from app.database.generated.models import Sandbox, SandboxStatus
from app.database.generated import sandboxes as gen


class SandboxResource:
    """Wrapper for sandbox database queries.

    Provides both sync and async methods for all sandbox operations.
    Methods automatically handle connections from the pool unless an explicit
    connection is provided for transaction support.
    """

    def __init__(self, pool: ConnectionPool):
        """Initialize sandbox resource.

        Args:
            pool: Connection pool instance
        """
        self._pool = pool

    # Async methods

    async def create(
        self,
        *,
        user_id: UUID,
        status: SandboxStatus = SandboxStatus.STOPPED,
        conn: Optional[AsyncConnection] = None,
    ) -> Sandbox:
        """Create a new sandbox (async).

        Args:
            user_id: UUID of the user who owns the sandbox
            status: Initial sandbox status (default: STOPPED)
            conn: Optional explicit connection for transactions

        Returns:
            Created Sandbox model

        Example:
            sandbox = await database.Sandbox.create(user_id=uuid)
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            result = await querier.create_sandbox(
                gen.CreateSandboxParams(user_id=user_id, status=status)
            )
            if not result:
                raise RuntimeError("Failed to create sandbox")
            return result

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            result = await querier.create_sandbox(
                gen.CreateSandboxParams(user_id=user_id, status=status)
            )
            if not result:
                raise RuntimeError("Failed to create sandbox")
            return result

    async def get(
        self, *, id: UUID, conn: Optional[AsyncConnection] = None
    ) -> Optional[Sandbox]:
        """Get sandbox by ID (async).

        Args:
            id: Sandbox UUID
            conn: Optional explicit connection for transactions

        Returns:
            Sandbox model if found, None otherwise

        Example:
            sandbox = await database.Sandbox.get(id=sandbox_id)
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.get_sandbox(gen.GetSandboxParams(id=id))

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.get_sandbox(gen.GetSandboxParams(id=id))

    async def get_by_user(
        self, *, user_id: UUID, conn: Optional[AsyncConnection] = None
    ) -> list[Sandbox]:
        """Get all sandboxes for a user (async).

        Args:
            user_id: User UUID
            conn: Optional explicit connection for transactions

        Returns:
            List of Sandbox models (empty if none found)

        Example:
            sandboxes = await database.Sandbox.get_by_user(user_id=user_id)
        """

        async def _query(conn: AsyncConnection) -> list[Sandbox]:
            querier = gen.AsyncQuerier(conn)
            # Convert AsyncIterator to list
            return [
                s
                async for s in querier.get_sandboxes_by_user(
                    gen.GetSandboxesByUserParams(user_id=user_id)
                )
            ]

        if conn:
            return await _query(conn)

        async with self._pool.async_connection() as conn:
            return await _query(conn)

    async def get_active_by_user(
        self, *, user_id: UUID, conn: Optional[AsyncConnection] = None
    ) -> list[Sandbox]:
        """Get active sandboxes for a user (async).

        Args:
            user_id: User UUID
            conn: Optional explicit connection for transactions

        Returns:
            List of active Sandbox models (empty if none found)

        Example:
            active = await database.Sandbox.get_active_by_user(user_id=user_id)
        """

        async def _query(conn: AsyncConnection) -> list[Sandbox]:
            querier = gen.AsyncQuerier(conn)
            return [
                s
                async for s in querier.get_active_sandboxes_by_user(
                    gen.GetActiveSandboxesByUserParams(user_id=user_id)
                )
            ]

        if conn:
            return await _query(conn)

        async with self._pool.async_connection() as conn:
            return await _query(conn)

    async def update_status(
        self,
        *,
        id: UUID,
        status: SandboxStatus,
        conn: Optional[AsyncConnection] = None,
    ) -> Optional[Sandbox]:
        """Update sandbox status (async).

        Args:
            id: Sandbox UUID
            status: New status
            conn: Optional explicit connection for transactions

        Returns:
            Updated Sandbox model if found, None otherwise

        Example:
            sandbox = await database.Sandbox.update_status(
                id=sandbox_id,
                status=SandboxStatus.ACTIVE
            )
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.update_sandbox_status(
                gen.UpdateSandboxStatusParams(id=id, status=status)
            )

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.update_sandbox_status(
                gen.UpdateSandboxStatusParams(id=id, status=status)
            )

    async def delete(
        self, *, id: UUID, conn: Optional[AsyncConnection] = None
    ) -> None:
        """Delete a sandbox (async).

        Args:
            id: Sandbox UUID
            conn: Optional explicit connection for transactions

        Example:
            await database.Sandbox.delete(id=sandbox_id)
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            await querier.delete_sandbox(gen.DeleteSandboxParams(id=id))
            return

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            await querier.delete_sandbox(gen.DeleteSandboxParams(id=id))

    async def count_by_user(
        self, *, user_id: UUID, conn: Optional[AsyncConnection] = None
    ) -> int:
        """Count sandboxes for a user (async).

        Args:
            user_id: User UUID
            conn: Optional explicit connection for transactions

        Returns:
            Number of sandboxes (0 if none)

        Example:
            count = await database.Sandbox.count_by_user(user_id=user_id)
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            count = await querier.count_sandboxes_by_user(
                gen.CountSandboxesByUserParams(user_id=user_id)
            )
            return count or 0

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            count = await querier.count_sandboxes_by_user(
                gen.CountSandboxesByUserParams(user_id=user_id)
            )
            return count or 0

    # Sync methods

    def create_sync(
        self,
        *,
        user_id: UUID,
        status: SandboxStatus = SandboxStatus.STOPPED,
        conn: Optional[Connection] = None,
    ) -> Sandbox:
        """Create a new sandbox (sync).

        Args:
            user_id: UUID of the user who owns the sandbox
            status: Initial sandbox status (default: STOPPED)
            conn: Optional explicit connection for transactions

        Returns:
            Created Sandbox model

        Example:
            sandbox = database.Sandbox.create_sync(user_id=uuid)
        """
        if conn:
            querier = gen.Querier(conn)
            result = querier.create_sandbox(
                gen.CreateSandboxParams(user_id=user_id, status=status)
            )
            if not result:
                raise RuntimeError("Failed to create sandbox")
            return result

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            result = querier.create_sandbox(
                gen.CreateSandboxParams(user_id=user_id, status=status)
            )
            if not result:
                raise RuntimeError("Failed to create sandbox")
            return result

    def get_sync(
        self, *, id: UUID, conn: Optional[Connection] = None
    ) -> Optional[Sandbox]:
        """Get sandbox by ID (sync).

        Args:
            id: Sandbox UUID
            conn: Optional explicit connection for transactions

        Returns:
            Sandbox model if found, None otherwise
        """
        if conn:
            querier = gen.Querier(conn)
            return querier.get_sandbox(gen.GetSandboxParams(id=id))

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            return querier.get_sandbox(gen.GetSandboxParams(id=id))

    def get_by_user_sync(
        self, *, user_id: UUID, conn: Optional[Connection] = None
    ) -> list[Sandbox]:
        """Get all sandboxes for a user (sync).

        Args:
            user_id: User UUID
            conn: Optional explicit connection for transactions

        Returns:
            List of Sandbox models (empty if none found)
        """

        def _query(conn: Connection) -> list[Sandbox]:
            querier = gen.Querier(conn)
            # Convert Iterator to list
            return list(
                querier.get_sandboxes_by_user(
                    gen.GetSandboxesByUserParams(user_id=user_id)
                )
            )

        if conn:
            return _query(conn)

        with self._pool.connection() as conn:
            return _query(conn)

    def get_active_by_user_sync(
        self, *, user_id: UUID, conn: Optional[Connection] = None
    ) -> list[Sandbox]:
        """Get active sandboxes for a user (sync).

        Args:
            user_id: User UUID
            conn: Optional explicit connection for transactions

        Returns:
            List of active Sandbox models (empty if none found)
        """

        def _query(conn: Connection) -> list[Sandbox]:
            querier = gen.Querier(conn)
            return list(
                querier.get_active_sandboxes_by_user(
                    gen.GetActiveSandboxesByUserParams(user_id=user_id)
                )
            )

        if conn:
            return _query(conn)

        with self._pool.connection() as conn:
            return _query(conn)

    def update_status_sync(
        self,
        *,
        id: UUID,
        status: SandboxStatus,
        conn: Optional[Connection] = None,
    ) -> Optional[Sandbox]:
        """Update sandbox status (sync).

        Args:
            id: Sandbox UUID
            status: New status
            conn: Optional explicit connection for transactions

        Returns:
            Updated Sandbox model if found, None otherwise
        """
        if conn:
            querier = gen.Querier(conn)
            return querier.update_sandbox_status(
                gen.UpdateSandboxStatusParams(id=id, status=status)
            )

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            return querier.update_sandbox_status(
                gen.UpdateSandboxStatusParams(id=id, status=status)
            )

    def delete_sync(self, *, id: UUID, conn: Optional[Connection] = None) -> None:
        """Delete a sandbox (sync).

        Args:
            id: Sandbox UUID
            conn: Optional explicit connection for transactions
        """
        if conn:
            querier = gen.Querier(conn)
            querier.delete_sandbox(gen.DeleteSandboxParams(id=id))
            return

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            querier.delete_sandbox(gen.DeleteSandboxParams(id=id))

    def count_by_user_sync(
        self, *, user_id: UUID, conn: Optional[Connection] = None
    ) -> int:
        """Count sandboxes for a user (sync).

        Args:
            user_id: User UUID
            conn: Optional explicit connection for transactions

        Returns:
            Number of sandboxes (0 if none)
        """
        if conn:
            querier = gen.Querier(conn)
            count = querier.count_sandboxes_by_user(
                gen.CountSandboxesByUserParams(user_id=user_id)
            )
            return count or 0

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            count = querier.count_sandboxes_by_user(
                gen.CountSandboxesByUserParams(user_id=user_id)
            )
            return count or 0


__all__ = ["SandboxResource"]
