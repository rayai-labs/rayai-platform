"""Helper functions and extensions for database models."""

from app.database.generated.models import Sandbox


def get_sandbox_session_id(sandbox: Sandbox) -> str:
    """Generate Ray session ID for a sandbox.

    Format: {user_id}-{sandbox_id}

    Args:
        sandbox: Sandbox model instance

    Returns:
        Session ID string for Ray agents

    Example:
        session_id = get_sandbox_session_id(sandbox)
    """
    return f"{sandbox.user_id}-{sandbox.id}"


__all__ = ["get_sandbox_session_id"]
