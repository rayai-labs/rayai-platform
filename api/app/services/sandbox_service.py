"""Thin service layer for sandbox operations - delegates orchestration to ray-agents."""

import base64
from typing import Optional
from uuid import UUID

import ray
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.database.models import Sandbox, SandboxStatus
from app.schemas.sandbox import (
    ExecutionResult,
    InstallResult,
    UploadResult,
    SessionStats,
)

# Import ray-agents code interpreter functions
# These handle ALL orchestration logic
from ray_agents.code_interpreter import (
    execute_code,
    install_package,
    upload_file,
    get_session_stats,
    cleanup_session,
)


class SandboxService:
    """Service for managing sandboxes.

    IMPORTANT: This is a THIN layer that only handles:
    - Database CRUD operations
    - User authorization (verify sandbox ownership)
    - Direct passthrough to ray-agents functions

    ALL orchestration logic (Docker, Ray actors, state management) is in ray-agents.
    """

    @staticmethod
    def _get_sandbox(sandbox_id: UUID, user_id: UUID, db: Session) -> Sandbox:
        """Get sandbox and verify ownership.

        Args:
            sandbox_id: Sandbox UUID
            user_id: User UUID
            db: Database session

        Returns:
            Sandbox object

        Raises:
            HTTPException 404: If sandbox not found
            HTTPException 403: If user doesn't own the sandbox
        """
        sandbox = db.query(Sandbox).filter(Sandbox.id == sandbox_id).first()

        if not sandbox:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sandbox {sandbox_id} not found",
            )

        if sandbox.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this sandbox",
            )

        return sandbox

    @staticmethod
    def create_sandbox(user_id: UUID, db: Session) -> Sandbox:
        """Create a new sandbox (database record only).

        Args:
            user_id: User UUID
            db: Database session

        Returns:
            Created sandbox object
        """
        sandbox = Sandbox(
            user_id=user_id,
            status=SandboxStatus.STOPPED,
        )
        db.add(sandbox)
        db.commit()
        db.refresh(sandbox)
        return sandbox

    @staticmethod
    def list_sandboxes(user_id: UUID, db: Session) -> list[Sandbox]:
        """List all sandboxes for a user.

        Args:
            user_id: User UUID
            db: Database session

        Returns:
            List of sandbox objects
        """
        return db.query(Sandbox).filter(Sandbox.user_id == user_id).all()

    @staticmethod
    def get_sandbox(sandbox_id: UUID, user_id: UUID, db: Session) -> Sandbox:
        """Get a sandbox by ID.

        Args:
            sandbox_id: Sandbox UUID
            user_id: User UUID
            db: Database session

        Returns:
            Sandbox object

        Raises:
            HTTPException: If not found or not authorized
        """
        return SandboxService._get_sandbox(sandbox_id, user_id, db)

    @staticmethod
    def start_sandbox(sandbox_id: UUID, user_id: UUID, db: Session) -> Sandbox:
        """Start a sandbox and create the Ray CodeInterpreterExecutor actor.

        This explicitly creates the ray-agents session actor so that install_package
        and upload_file operations can be called without requiring execute_code first.

        Args:
            sandbox_id: Sandbox UUID
            user_id: User UUID
            db: Database session

        Returns:
            Updated sandbox object

        Raises:
            HTTPException: If actor creation fails
        """
        sandbox = SandboxService._get_sandbox(sandbox_id, user_id, db)
        session_id = sandbox.get_session_id()

        # Create the CodeInterpreterExecutor actor explicitly
        # This uses the same naming convention as ray-agents:
        # - Actor name: f"code-executor-{session_id}"
        # - Namespace: "code-interpreter"
        try:
            from ray_agents.code_interpreter.executor import CodeInterpreterExecutor

            actor_name = f"code-executor-{session_id}"

            # Try to get existing actor first
            try:
                ray.get_actor(actor_name, namespace="code-interpreter")
                # Actor already exists, that's fine
            except ValueError:
                # Actor doesn't exist, create it
                CodeInterpreterExecutor.options(
                    name=actor_name,
                    namespace="code-interpreter",
                    lifetime="detached",  # Survives driver process exits
                ).remote(session_id=session_id)

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create sandbox session: {str(e)}",
            )

        sandbox.status = SandboxStatus.ACTIVE
        db.commit()
        db.refresh(sandbox)
        return sandbox

    @staticmethod
    def stop_sandbox(sandbox_id: UUID, user_id: UUID, db: Session) -> Sandbox:
        """Stop a sandbox and cleanup Ray session.

        Args:
            sandbox_id: Sandbox UUID
            user_id: User UUID
            db: Database session

        Returns:
            Updated sandbox object

        Raises:
            HTTPException: If cleanup fails
        """
        sandbox = SandboxService._get_sandbox(sandbox_id, user_id, db)

        # Call ray-agents to cleanup session (orchestration in ray-agents)
        session_id = sandbox.get_session_id()
        try:
            result = ray.get(cleanup_session.remote(session_id))
            # Result will have status='success' or 'error'
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to cleanup sandbox: {str(e)}",
            )

        sandbox.status = SandboxStatus.STOPPED
        db.commit()
        db.refresh(sandbox)
        return sandbox

    @staticmethod
    def execute_code(
        sandbox_id: UUID,
        user_id: UUID,
        code: str,
        timeout: int,
        environment: Optional[dict[str, str]],
        db: Session,
    ) -> ExecutionResult:
        """Execute code in a sandbox.

        Args:
            sandbox_id: Sandbox UUID
            user_id: User UUID
            code: Python code to execute
            timeout: Execution timeout in seconds
            environment: Optional environment variables
            db: Database session

        Returns:
            ExecutionResult from ray-agents

        Raises:
            HTTPException: If execution fails
        """
        sandbox = SandboxService._get_sandbox(sandbox_id, user_id, db)

        # Build session ID
        session_id = sandbox.get_session_id()

        # Call ray-agents execute_code (ALL orchestration in ray-agents)
        try:
            result = ray.get(
                execute_code.remote(
                    code=code,
                    session_id=session_id,
                    timeout=timeout,
                    environment=environment,
                )
            )
            return ExecutionResult(**result)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to execute code: {str(e)}",
            )

    @staticmethod
    def install_package(
        sandbox_id: UUID,
        user_id: UUID,
        package: str,
        db: Session,
    ) -> InstallResult:
        """Install a package in a sandbox.

        Args:
            sandbox_id: Sandbox UUID
            user_id: User UUID
            package: Package name (e.g., 'numpy==1.24.0')
            db: Database session

        Returns:
            InstallResult from ray-agents

        Raises:
            HTTPException: If installation fails
        """
        sandbox = SandboxService._get_sandbox(sandbox_id, user_id, db)
        session_id = sandbox.get_session_id()

        # Call ray-agents install_package (orchestration in ray-agents)
        try:
            result = ray.get(install_package.remote(package=package, session_id=session_id))
            return InstallResult(**result)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to install package: {str(e)}",
            )

    @staticmethod
    def upload_file(
        sandbox_id: UUID,
        user_id: UUID,
        path: str,
        content: str,
        db: Session,
    ) -> UploadResult:
        """Upload a file to a sandbox.

        Args:
            sandbox_id: Sandbox UUID
            user_id: User UUID
            path: Destination path in sandbox
            content: Base64-encoded file content
            db: Database session

        Returns:
            UploadResult from ray-agents

        Raises:
            HTTPException: If upload fails
        """
        sandbox = SandboxService._get_sandbox(sandbox_id, user_id, db)
        session_id = sandbox.get_session_id()

        # Decode base64 content
        try:
            file_bytes = base64.b64decode(content)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid base64 content: {str(e)}",
            )

        # Call ray-agents upload_file (orchestration in ray-agents)
        try:
            result = ray.get(
                upload_file.remote(path=path, content=file_bytes, session_id=session_id)
            )
            return UploadResult(**result)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file: {str(e)}",
            )

    @staticmethod
    def get_stats(sandbox_id: UUID, user_id: UUID, db: Session) -> SessionStats:
        """Get sandbox session statistics.

        Args:
            sandbox_id: Sandbox UUID
            user_id: User UUID
            db: Database session

        Returns:
            SessionStats from ray-agents

        Raises:
            HTTPException: If stats retrieval fails
        """
        sandbox = SandboxService._get_sandbox(sandbox_id, user_id, db)
        session_id = sandbox.get_session_id()

        # Call ray-agents get_session_stats (orchestration in ray-agents)
        try:
            result = ray.get(get_session_stats.remote(session_id=session_id))
            return SessionStats(**result)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get stats: {str(e)}",
            )

    @staticmethod
    def delete_sandbox(sandbox_id: UUID, user_id: UUID, db: Session) -> None:
        """Delete a sandbox.

        Args:
            sandbox_id: Sandbox UUID
            user_id: User UUID
            db: Database session

        Raises:
            HTTPException: If deletion fails
        """
        sandbox = SandboxService._get_sandbox(sandbox_id, user_id, db)

        # Cleanup Ray session if sandbox is active
        if sandbox.status == SandboxStatus.ACTIVE:
            session_id = sandbox.get_session_id()
            try:
                ray.get(cleanup_session.remote(session_id))
            except Exception:
                # Continue with deletion even if cleanup fails
                pass

        # Delete database record
        db.delete(sandbox)
        db.commit()
