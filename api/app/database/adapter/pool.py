"""Connection pool management for both sync and async database operations."""

from contextlib import asynccontextmanager, contextmanager
from typing import AsyncIterator, Iterator

from sqlalchemy import Connection, create_engine
from sqlalchemy.ext.asyncio import AsyncConnection, AsyncEngine, create_async_engine


class ConnectionPool:
    """Manages both sync and async SQLAlchemy connection pools.

    This pool supports both synchronous and asynchronous database operations,
    allowing the application to use whichever is most appropriate for the context.
    """

    def __init__(self, database_url: str):
        """Initialize connection pools.

        Args:
            database_url: PostgreSQL connection string (e.g., postgresql://user:pass@host/db)
        """
        # Sync engine
        self._sync_engine = create_engine(
            database_url,
            pool_pre_ping=True,  # Verify connections before using
            pool_size=10,
            max_overflow=20,
        )

        # Async engine (convert postgresql:// to postgresql+asyncpg://)
        async_url = database_url.replace("postgresql://", "postgresql+asyncpg://")
        self._async_engine: AsyncEngine = create_async_engine(
            async_url,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
        )

    @contextmanager
    def connection(self) -> Iterator[Connection]:
        """Get sync connection as context manager.

        Usage:
            with pool.connection() as conn:
                # Use conn for queries

        Yields:
            SQLAlchemy sync Connection
        """
        with self._sync_engine.connect() as conn:
            with conn.begin():  # Auto-commit on exit, rollback on exception
                yield conn

    @asynccontextmanager
    async def async_connection(self) -> AsyncIterator[AsyncConnection]:
        """Get async connection as context manager.

        Usage:
            async with pool.async_connection() as conn:
                # Use conn for queries

        Yields:
            SQLAlchemy async AsyncConnection
        """
        async with self._async_engine.begin() as conn:  # Auto-commit/rollback
            yield conn

    async def close(self) -> None:
        """Close all connections in both pools.

        Should be called during application shutdown.
        """
        await self._async_engine.dispose()
        self._sync_engine.dispose()


__all__ = ["ConnectionPool"]
