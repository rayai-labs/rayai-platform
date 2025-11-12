"""API key authentication service for secure API key validation."""

import hashlib
from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.database.models import ApiKey, Profile


class ApiKeyAuthService:
    """Service for API key authentication."""
    
    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """Hash an API key using SHA-256.
        
        Args:
            api_key: Raw API key (e.g., ray_ai_sk_abc123...)
            
        Returns:
            SHA-256 hash of the key
        """
        return hashlib.sha256(api_key.encode()).hexdigest()
    
    @staticmethod
    def validate_api_key_format(api_key: str) -> bool:
        """Validate API key format.
        
        Args:
            api_key: API key to validate
            
        Returns:
            True if format is valid
        """
        return (
            api_key.startswith("ray_ai_sk_") and 
            len(api_key) >= 20 and
            len(api_key) <= 200
        )
    
    @staticmethod
    async def authenticate_api_key(api_key: str, db: Session) -> UUID:
        """Authenticate API key and return user ID.
        
        Args:
            api_key: Raw API key from Authorization header
            db: Database session
            
        Returns:
            User ID if authentication successful
            
        Raises:
            HTTPException: If authentication fails
        """
        if not ApiKeyAuthService.validate_api_key_format(api_key):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key format"
            )
        
        key_hash = ApiKeyAuthService.hash_api_key(api_key)
        
        api_key_record = db.query(ApiKey).filter(
            ApiKey.key_hash == key_hash
        ).first()
        
        if not api_key_record:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key"
            )
        
        try:
            api_key_record.last_used_at = datetime.utcnow()
            db.commit()
        except Exception:
            db.rollback()
        
        return api_key_record.user_id
    
    @staticmethod
    async def get_user_profile(user_id: UUID, db: Session) -> Optional[Profile]:
        """Get user profile by ID.
        
        Args:
            user_id: User UUID
            db: Database session
            
        Returns:
            Profile object or None if not found
        """
        return db.query(Profile).filter(Profile.id == user_id).first()