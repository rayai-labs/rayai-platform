"""Pydantic schemas for sandbox API request/response validation."""

from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from pydantic import BaseModel, Field


# Response Models


class SandboxResponse(BaseModel):
    """Sandbox resource response."""

    id: UUID
    user_id: UUID
    status: Literal["active", "stopped"]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ExecutionResult(BaseModel):
    """Result from code execution in sandbox."""

    status: Literal["success", "error"]
    stdout: str
    stderr: str
    exit_code: Optional[int] = None
    execution_id: Optional[str] = None
    error_type: Optional[str] = None


class InstallResult(BaseModel):
    """Result from package installation."""

    status: Literal["success", "error"]
    package: str
    message: str


class UploadResult(BaseModel):
    """Result from file upload."""

    status: Literal["success", "error"]
    path: str
    message: str
    size_bytes: Optional[int] = None


class SessionStats(BaseModel):
    """Statistics about a sandbox session."""

    session_id: str
    execution_count: int
    created_at: datetime
    uptime: float
    container_status: str


# Request Models


class ExecuteRequest(BaseModel):
    """Request to execute code in a sandbox."""

    code: str = Field(..., min_length=1, max_length=100000, description="Python code to execute")
    timeout: Optional[int] = Field(
        default=30,
        ge=1,
        le=300,
        description="Execution timeout in seconds (1-300)",
    )
    environment: Optional[dict[str, str]] = Field(
        default=None,
        description="Optional environment variables",
    )


class InstallRequest(BaseModel):
    """Request to install a package in a sandbox."""

    package: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Package name (optionally with version, e.g., 'numpy==1.24.0')",
    )


class UploadRequest(BaseModel):
    """Request to upload a file to a sandbox."""

    path: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Destination path in the sandbox (e.g., '/tmp/data.csv')",
    )
    content: str = Field(
        ...,
        description="Base64-encoded file content",
    )


# Error Response Model


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str
    error_code: Optional[str] = None
