"""Profile resource wrapper for database operations."""

from typing import Optional
from uuid import UUID

from sqlalchemy import Connection
from sqlalchemy.ext.asyncio import AsyncConnection

from app.database.adapter.pool import ConnectionPool
from app.database.generated.models import Profile
from app.database.generated import profiles as gen


class ProfileResource:
    """Wrapper for profile database queries.

    Provides both sync and async methods for all profile operations.
    """

    def __init__(self, pool: ConnectionPool):
        """Initialize profile resource.

        Args:
            pool: Connection pool instance
        """
        self._pool = pool

    # Async methods

    async def create(
        self,
        *,
        id: UUID,
        email: str,
        full_name: Optional[str] = None,
        avatar_url: Optional[str] = None,
        provider: Optional[str] = None,
        provider_id: Optional[str] = None,
        conn: Optional[AsyncConnection] = None,
    ) -> Profile:
        """Create a new profile (async).

        Args:
            id: Profile UUID (usually from auth.users)
            email: User email
            full_name: User's full name
            avatar_url: URL to user's avatar image
            provider: OAuth provider (e.g., 'google', 'github')
            provider_id: Provider's user ID
            conn: Optional explicit connection for transactions

        Returns:
            Created Profile model

        Example:
            profile = await database.Profile.create(
                id=user_id,
                email="user@example.com",
                full_name="John Doe"
            )
        """
        params = gen.CreateProfileParams(
            id=id,
            email=email,
            full_name=full_name,
            avatar_url=avatar_url,
            provider=provider,
            provider_id=provider_id,
        )

        if conn:
            querier = gen.AsyncQuerier(conn)
            result = await querier.create_profile(params)
            if not result:
                raise RuntimeError("Failed to create profile")
            return result

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            result = await querier.create_profile(params)
            if not result:
                raise RuntimeError("Failed to create profile")
            return result

    async def get(
        self, *, id: UUID, conn: Optional[AsyncConnection] = None
    ) -> Optional[Profile]:
        """Get profile by ID (async).

        Args:
            id: Profile UUID
            conn: Optional explicit connection for transactions

        Returns:
            Profile model if found, None otherwise
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.get_profile(gen.GetProfileParams(id=id))

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.get_profile(gen.GetProfileParams(id=id))

    async def get_by_email(
        self, *, email: str, conn: Optional[AsyncConnection] = None
    ) -> Optional[Profile]:
        """Get profile by email (async).

        Args:
            email: User email
            conn: Optional explicit connection for transactions

        Returns:
            Profile model if found, None otherwise
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.get_profile_by_email(
                gen.GetProfileByEmailParams(email=email)
            )

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.get_profile_by_email(
                gen.GetProfileByEmailParams(email=email)
            )

    async def update(
        self,
        *,
        id: UUID,
        full_name: Optional[str] = None,
        avatar_url: Optional[str] = None,
        conn: Optional[AsyncConnection] = None,
    ) -> Optional[Profile]:
        """Update profile (async).

        Args:
            id: Profile UUID
            full_name: New full name (or None to keep current)
            avatar_url: New avatar URL (or None to keep current)
            conn: Optional explicit connection for transactions

        Returns:
            Updated Profile model if found, None otherwise

        Note:
            Uses COALESCE in SQL - only non-None values will update
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.update_profile(
                gen.UpdateProfileParams(
                    id=id, full_name=full_name, avatar_url=avatar_url
                )
            )

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            return await querier.update_profile(
                gen.UpdateProfileParams(
                    id=id, full_name=full_name, avatar_url=avatar_url
                )
            )

    async def delete(
        self, *, id: UUID, conn: Optional[AsyncConnection] = None
    ) -> None:
        """Delete a profile (async).

        Args:
            id: Profile UUID
            conn: Optional explicit connection for transactions
        """
        if conn:
            querier = gen.AsyncQuerier(conn)
            await querier.delete_profile(gen.DeleteProfileParams(id=id))
            return

        async with self._pool.async_connection() as conn:
            querier = gen.AsyncQuerier(conn)
            await querier.delete_profile(gen.DeleteProfileParams(id=id))

    async def list_all(
        self,
        *,
        limit: int = 100,
        offset: int = 0,
        conn: Optional[AsyncConnection] = None,
    ) -> list[Profile]:
        """List profiles with pagination (async).

        Args:
            limit: Maximum number of profiles to return
            offset: Number of profiles to skip
            conn: Optional explicit connection for transactions

        Returns:
            List of Profile models
        """

        async def _query(conn: AsyncConnection) -> list[Profile]:
            querier = gen.AsyncQuerier(conn)
            return [
                p
                async for p in querier.list_profiles(
                    gen.ListProfilesParams(limit=limit, offset=offset)
                )
            ]

        if conn:
            return await _query(conn)

        async with self._pool.async_connection() as conn:
            return await _query(conn)

    # Sync methods

    def create_sync(
        self,
        *,
        id: UUID,
        email: str,
        full_name: Optional[str] = None,
        avatar_url: Optional[str] = None,
        provider: Optional[str] = None,
        provider_id: Optional[str] = None,
        conn: Optional[Connection] = None,
    ) -> Profile:
        """Create a new profile (sync)."""
        params = gen.CreateProfileParams(
            id=id,
            email=email,
            full_name=full_name,
            avatar_url=avatar_url,
            provider=provider,
            provider_id=provider_id,
        )

        if conn:
            querier = gen.Querier(conn)
            result = querier.create_profile(params)
            if not result:
                raise RuntimeError("Failed to create profile")
            return result

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            result = querier.create_profile(params)
            if not result:
                raise RuntimeError("Failed to create profile")
            return result

    def get_sync(
        self, *, id: UUID, conn: Optional[Connection] = None
    ) -> Optional[Profile]:
        """Get profile by ID (sync)."""
        if conn:
            querier = gen.Querier(conn)
            return querier.get_profile(gen.GetProfileParams(id=id))

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            return querier.get_profile(gen.GetProfileParams(id=id))

    def get_by_email_sync(
        self, *, email: str, conn: Optional[Connection] = None
    ) -> Optional[Profile]:
        """Get profile by email (sync)."""
        if conn:
            querier = gen.Querier(conn)
            return querier.get_profile_by_email(gen.GetProfileByEmailParams(email=email))

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            return querier.get_profile_by_email(gen.GetProfileByEmailParams(email=email))

    def update_sync(
        self,
        *,
        id: UUID,
        full_name: Optional[str] = None,
        avatar_url: Optional[str] = None,
        conn: Optional[Connection] = None,
    ) -> Optional[Profile]:
        """Update profile (sync)."""
        if conn:
            querier = gen.Querier(conn)
            return querier.update_profile(
                gen.UpdateProfileParams(
                    id=id, full_name=full_name, avatar_url=avatar_url
                )
            )

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            return querier.update_profile(
                gen.UpdateProfileParams(
                    id=id, full_name=full_name, avatar_url=avatar_url
                )
            )

    def delete_sync(self, *, id: UUID, conn: Optional[Connection] = None) -> None:
        """Delete a profile (sync)."""
        if conn:
            querier = gen.Querier(conn)
            querier.delete_profile(gen.DeleteProfileParams(id=id))
            return

        with self._pool.connection() as conn:
            querier = gen.Querier(conn)
            querier.delete_profile(gen.DeleteProfileParams(id=id))

    def list_sync(
        self,
        *,
        limit: int = 100,
        offset: int = 0,
        conn: Optional[Connection] = None,
    ) -> list[Profile]:
        """List profiles with pagination (sync)."""

        def _query(conn: Connection) -> list[Profile]:
            querier = gen.Querier(conn)
            return list(
                querier.list_profiles(
                    gen.ListProfilesParams(limit=limit, offset=offset)
                )
            )

        if conn:
            return _query(conn)

        with self._pool.connection() as conn:
            return _query(conn)


__all__ = ["ProfileResource"]
