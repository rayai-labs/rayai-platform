"""SQLAlchemy database models matching Supabase schema."""

import enum
from datetime import datetime
from uuid import UUID

from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class SandboxStatus(str, enum.Enum):
    """Sandbox status enum matching Supabase enum type."""

    ACTIVE = "active"
    STOPPED = "stopped"


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
        Enum(SandboxStatus, name="sandbox_status"),
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
