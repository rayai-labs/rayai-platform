"""SQLAlchemy database models matching Supabase schema."""

from datetime import datetime
from enum import StrEnum
from uuid import UUID

from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, ENUM
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class SandboxStatus(StrEnum):
    """Sandbox status enum matching Supabase enum type."""

    STOPPED = "stopped"
    ACTIVE = "active"


class Profile(Base):
    """User profile table."""

    __tablename__ = "profile"

    id = Column(PG_UUID(as_uuid=True), primary_key=True)
    email = Column(Text, nullable=False)
    full_name = Column(Text)
    avatar_url = Column(Text)
    provider = Column(Text)
    provider_id = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Sandbox(Base):
    """Sandbox table for code interpreter sessions."""

    __tablename__ = "sandbox"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("profile.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    status = Column(
        ENUM(
            "stopped",
            "active",
            name="sandbox_status",
            create_type=False,  # Don't create type, it already exists in DB
        ),
        nullable=False,
        server_default="stopped",
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def get_session_id(self) -> str:
        """Generate Ray session ID for this sandbox.

        Format: {user_id}-{sandbox_id}
        """
        return f"{self.user_id}-{self.id}"


class ApiKey(Base):
    """API key table for authentication."""
    
    __tablename__ = "api_key"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(
        PG_UUID(as_uuid=True), 
        ForeignKey("profile.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    name = Column(Text, nullable=False)
    key_hash = Column(Text, nullable=False, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True))
    
    def __repr__(self):
        return f"<ApiKey(id={self.id}, user_id={self.user_id}, name='{self.name}')>"
