"""Authentication middleware using Supabase JWT tokens."""

from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from app.config import settings

security = HTTPBearer()


async def get_stub_user_id() -> UUID:
    """Return a stub user ID for local testing without authentication.

    This bypasses all authentication checks and returns a hardcoded test user ID.
    USE ONLY FOR LOCAL DEVELOPMENT/TESTING.

    Returns:
        user_id: Hardcoded test user UUID
    """
    # TODO: Replace with actual user ID from your database if needed
    return UUID("00000000-0000-0000-0000-000000000001")


async def get_current_user_id() -> UUID:
    """STUB: Return hardcoded test user ID for local testing.

    TODO: Re-enable JWT verification for production.

    Original implementation (commented out):
    Verify Supabase JWT token and extract user_id from Authorization header.
    """
    # STUB: Return test user ID without authentication
    return UUID("00000000-0000-0000-0000-000000000001")

    # # Original JWT verification code (disabled for local testing):
    # try:
    #     token = credentials.credentials
    #
    #     # Decode and verify JWT token
    #     payload = jwt.decode(
    #         token,
    #         settings.supabase_jwt_secret,
    #         algorithms=["HS256"],
    #         audience="authenticated",
    #     )
    #
    #     # Extract user ID from 'sub' claim
    #     user_id_str: Optional[str] = payload.get("sub")
    #     if user_id_str is None:
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="Invalid token: missing subject",
    #         )
    #
    #     # Convert to UUID
    #     user_id = UUID(user_id_str)
    #     return user_id
    #
    # except JWTError as e:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail=f"Invalid token: {str(e)}",
    #     )
    # except ValueError as e:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail=f"Invalid user ID format: {str(e)}",
    #     )
