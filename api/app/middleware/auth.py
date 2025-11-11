"""Authentication middleware using API keys."""

from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.api_key_auth_service import ApiKeyAuthService

security = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> UUID:
    """Authenticate API key and return user ID.
    
    Args:
        credentials: HTTP Bearer token credentials
        db: Database session
        
    Returns:
        User ID if authentication successful
        
    Raises:
        HTTPException: If authentication fails
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key"
        )
    
    api_key = credentials.credentials
    
    try:
        user_id = await ApiKeyAuthService.authenticate_api_key(api_key, db)
        return user_id
    except HTTPException:
        raise
    except Exception as e:
        print(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service error"
        )


# Optional: Get current user profile
async def get_current_user(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get current user profile.
    
    Returns:
        Profile object for the authenticated user
    """
    user = await ApiKeyAuthService.get_user_profile(user_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
    return user
