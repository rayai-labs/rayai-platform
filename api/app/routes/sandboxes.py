"""FastAPI routes for sandbox management."""

from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import get_current_user_id
from app.schemas.sandbox import (
    SandboxResponse,
    ExecuteRequest,
    ExecutionResult,
    InstallRequest,
    InstallResult,
    UploadRequest,
    UploadResult,
    SessionStats,
)
from app.services.sandbox_service import SandboxService

router = APIRouter()


@router.post("/sandboxes", response_model=SandboxResponse, status_code=status.HTTP_201_CREATED)
async def create_sandbox(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Create a new sandbox.

    Returns a sandbox in 'stopped' status. Call /start to activate it.
    """
    sandbox = SandboxService.create_sandbox(user_id, db)
    return sandbox


@router.get("/sandboxes", response_model=list[SandboxResponse])
async def list_sandboxes(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """List all sandboxes for the authenticated user."""
    sandboxes = SandboxService.list_sandboxes(user_id, db)
    return sandboxes


@router.get("/sandboxes/{sandbox_id}", response_model=SandboxResponse)
async def get_sandbox(
    sandbox_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Get a sandbox by ID."""
    sandbox = SandboxService.get_sandbox(sandbox_id, user_id, db)
    return sandbox


@router.post("/sandboxes/{sandbox_id}/start", response_model=SandboxResponse)
async def start_sandbox(
    sandbox_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Start a sandbox (set status to 'active').

    Note: Ray session is auto-created on first code execution.
    """
    sandbox = SandboxService.start_sandbox(sandbox_id, user_id, db)
    return sandbox


@router.post("/sandboxes/{sandbox_id}/stop", response_model=SandboxResponse)
async def stop_sandbox(
    sandbox_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Stop a sandbox and cleanup its Ray session."""
    sandbox = SandboxService.stop_sandbox(sandbox_id, user_id, db)
    return sandbox


@router.post("/sandboxes/{sandbox_id}/execute", response_model=ExecutionResult)
async def execute_code(
    sandbox_id: UUID,
    request: ExecuteRequest,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Execute Python code in a sandbox.

    Returns stdout, stderr, and exit code.
    The sandbox session persists state between executions.
    """
    result = SandboxService.execute_code(
        sandbox_id=sandbox_id,
        user_id=user_id,
        code=request.code,
        timeout=request.timeout or 30,
        environment=request.environment,
        db=db,
    )
    return result


@router.post("/sandboxes/{sandbox_id}/install", response_model=InstallResult)
async def install_package(
    sandbox_id: UUID,
    request: InstallRequest,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Install a pip package in a sandbox.

    Example package formats:
    - 'numpy'
    - 'numpy==1.24.0'
    - 'pandas>=2.0.0'
    """
    result = SandboxService.install_package(
        sandbox_id=sandbox_id,
        user_id=user_id,
        package=request.package,
        db=db,
    )
    return result


@router.post("/sandboxes/{sandbox_id}/upload", response_model=UploadResult)
async def upload_file(
    sandbox_id: UUID,
    request: UploadRequest,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Upload a file to a sandbox.

    The file content should be base64-encoded.
    """
    result = SandboxService.upload_file(
        sandbox_id=sandbox_id,
        user_id=user_id,
        path=request.path,
        content=request.content,
        db=db,
    )
    return result


@router.get("/sandboxes/{sandbox_id}/stats", response_model=SessionStats)
async def get_stats(
    sandbox_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Get statistics about a sandbox session.

    Returns execution count, uptime, container status, etc.
    """
    stats = SandboxService.get_stats(sandbox_id, user_id, db)
    return stats


@router.delete("/sandboxes/{sandbox_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sandbox(
    sandbox_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Delete a sandbox and cleanup its Ray session."""
    SandboxService.delete_sandbox(sandbox_id, user_id, db)
    return None
