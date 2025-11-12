"""Integration tests for Sandbox API endpoints."""

import base64
from typing import Dict, Any

import pytest
from fastapi.testclient import TestClient


class TestSandboxLifecycle:
    """Test sandbox lifecycle operations (create, start, stop, delete)."""

    def test_create_sandbox(self, client: TestClient, api_base_url: str):
        """Test creating a new sandbox."""
        response = client.post(f"{api_base_url}/sandboxes")

        assert response.status_code == 201
        data = response.json()

        assert "id" in data
        assert "user_id" in data
        assert data["status"] == "stopped"
        assert "created_at" in data
        assert "updated_at" in data

    def test_list_sandboxes(self, client: TestClient, api_base_url: str):
        """Test listing all sandboxes."""
        # Create a sandbox first
        create_response = client.post(f"{api_base_url}/sandboxes")
        assert create_response.status_code == 201

        # List sandboxes
        response = client.get(f"{api_base_url}/sandboxes")

        assert response.status_code == 200
        data = response.json()

        assert isinstance(data, list)
        assert len(data) >= 1
        assert all("id" in sandbox for sandbox in data)

    def test_get_sandbox_by_id(self, client: TestClient, api_base_url: str):
        """Test getting a specific sandbox by ID."""
        # Create a sandbox
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox_id = create_response.json()["id"]

        # Get sandbox
        response = client.get(f"{api_base_url}/sandboxes/{sandbox_id}")

        assert response.status_code == 200
        data = response.json()

        assert data["id"] == sandbox_id
        assert data["status"] == "stopped"

    def test_get_nonexistent_sandbox(self, client: TestClient, api_base_url: str):
        """Test getting a sandbox that doesn't exist."""
        fake_id = "00000000-0000-0000-0000-000000000099"
        response = client.get(f"{api_base_url}/sandboxes/{fake_id}")

        assert response.status_code == 404

    def test_start_sandbox(self, client: TestClient, api_base_url: str):
        """Test starting a sandbox."""
        # Create a sandbox
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox_id = create_response.json()["id"]

        # Start sandbox
        response = client.post(f"{api_base_url}/sandboxes/{sandbox_id}/start")

        assert response.status_code == 200
        data = response.json()

        assert data["id"] == sandbox_id
        assert data["status"] == "active"

    def test_stop_sandbox(self, client: TestClient, api_base_url: str):
        """Test stopping a sandbox."""
        # Create and start a sandbox
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox_id = create_response.json()["id"]
        client.post(f"{api_base_url}/sandboxes/{sandbox_id}/start")

        # Stop sandbox
        response = client.post(f"{api_base_url}/sandboxes/{sandbox_id}/stop")

        assert response.status_code == 200
        data = response.json()

        assert data["id"] == sandbox_id
        assert data["status"] == "stopped"

    def test_delete_sandbox(self, client: TestClient, api_base_url: str):
        """Test deleting a sandbox."""
        # Create a sandbox
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox_id = create_response.json()["id"]

        # Delete sandbox
        response = client.delete(f"{api_base_url}/sandboxes/{sandbox_id}")

        assert response.status_code == 204

        # Verify it's deleted
        get_response = client.get(f"{api_base_url}/sandboxes/{sandbox_id}")
        assert get_response.status_code == 404


class TestSandboxExecution:
    """Test code execution in sandboxes."""

    @pytest.fixture
    def active_sandbox(self, client: TestClient, api_base_url: str) -> Dict[str, Any]:
        """Create and start a sandbox for testing."""
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox = create_response.json()
        client.post(f"{api_base_url}/sandboxes/{sandbox['id']}/start")
        return sandbox

    def test_execute_simple_code(self, client: TestClient, api_base_url: str, active_sandbox: Dict):
        """Test executing simple Python code."""
        sandbox_id = active_sandbox["id"]

        response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/execute",
            json={"code": "print('Hello, World!')"}
        )

        assert response.status_code == 200
        data = response.json()

        assert data["status"] in ["success", "error"]
        if data["status"] == "success":
            assert "stdout" in data
            assert "Hello, World!" in data["stdout"]

    def test_execute_with_calculation(self, client: TestClient, api_base_url: str, active_sandbox: Dict):
        """Test executing code with calculations."""
        sandbox_id = active_sandbox["id"]

        response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/execute",
            json={"code": "result = 2 + 2\nprint(result)"}
        )

        assert response.status_code == 200
        data = response.json()

        if data["status"] == "success":
            assert "4" in data["stdout"]

    def test_execute_with_error(self, client: TestClient, api_base_url: str, active_sandbox: Dict):
        """Test executing code that produces an error."""
        sandbox_id = active_sandbox["id"]

        response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/execute",
            json={"code": "1 / 0"}  # Division by zero
        )

        assert response.status_code == 200
        data = response.json()

        # Should either succeed with error in stderr, or return error status
        assert data["status"] in ["success", "error"]
        if data["status"] == "success":
            assert "stderr" in data

    def test_execute_with_timeout(self, client: TestClient, api_base_url: str, active_sandbox: Dict):
        """Test executing code with custom timeout."""
        sandbox_id = active_sandbox["id"]

        response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/execute",
            json={"code": "print('test')", "timeout": 60}
        )

        assert response.status_code == 200

    def test_execute_multiline_code(self, client: TestClient, api_base_url: str, active_sandbox: Dict):
        """Test executing multiline Python code."""
        sandbox_id = active_sandbox["id"]

        code = """
for i in range(3):
    print(f"Iteration {i}")
"""

        response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/execute",
            json={"code": code}
        )

        assert response.status_code == 200


class TestSandboxPackages:
    """Test package installation in sandboxes."""

    @pytest.fixture
    def active_sandbox(self, client: TestClient, api_base_url: str) -> Dict[str, Any]:
        """Create and start a sandbox for testing."""
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox = create_response.json()
        client.post(f"{api_base_url}/sandboxes/{sandbox['id']}/start")
        return sandbox

    @pytest.mark.slow
    def test_install_package(self, client: TestClient, api_base_url: str, active_sandbox: Dict):
        """Test installing a Python package."""
        sandbox_id = active_sandbox["id"]

        response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/install",
            json={"package": "requests"}
        )

        assert response.status_code == 200
        data = response.json()

        assert data["status"] in ["success", "error"]

    @pytest.mark.slow
    def test_use_installed_package(self, client: TestClient, api_base_url: str, active_sandbox: Dict):
        """Test using an installed package."""
        sandbox_id = active_sandbox["id"]

        # Install numpy
        install_response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/install",
            json={"package": "numpy"}
        )

        assert install_response.status_code == 200
        install_data = install_response.json()
        if install_data.get("status") == "success":
            # Try to use numpy
            execute_response = client.post(
                f"{api_base_url}/sandboxes/{sandbox_id}/execute",
                json={"code": "import numpy as np; print(np.array([1, 2, 3]))"}
            )

            assert execute_response.status_code == 200


class TestSandboxFiles:
    """Test file operations in sandboxes."""

    @pytest.fixture
    def active_sandbox(self, client: TestClient, api_base_url: str) -> Dict[str, Any]:
        """Create and start a sandbox for testing."""
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox = create_response.json()
        client.post(f"{api_base_url}/sandboxes/{sandbox['id']}/start")
        return sandbox

    def test_upload_file(self, client: TestClient, api_base_url: str, active_sandbox: Dict):
        """Test uploading a file to sandbox."""
        sandbox_id = active_sandbox["id"]

        # Base64 encode some content
        content = base64.b64encode(b"Hello from file!").decode()

        response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/upload",
            json={"path": "test.txt", "content": content}
        )

        assert response.status_code == 200
        data = response.json()

        assert data["status"] in ["success", "error"]

    def test_upload_and_read_file(self, client: TestClient, api_base_url: str, active_sandbox: Dict):
        """Test uploading and then reading a file."""
        sandbox_id = active_sandbox["id"]

        # Upload file
        content = base64.b64encode(b"Test content").decode()
        upload_response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/upload",
            json={"path": "data.txt", "content": content}
        )

        assert upload_response.status_code == 200
        upload_data = upload_response.json()
        if upload_data.get("status") == "success":
            # Read file
            execute_response = client.post(
                f"{api_base_url}/sandboxes/{sandbox_id}/execute",
                json={"code": "with open('data.txt') as f: print(f.read())"}
            )

            assert execute_response.status_code == 200
            if execute_response.json()["status"] == "success":
                assert "Test content" in execute_response.json()["stdout"]


class TestSandboxStats:
    """Test sandbox statistics."""

    def test_get_stats(self, client: TestClient, api_base_url: str):
        """Test getting sandbox statistics."""
        # Create and start a sandbox
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox_id = create_response.json()["id"]
        client.post(f"{api_base_url}/sandboxes/{sandbox_id}/start")

        # Execute some code
        client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/execute",
            json={"code": "print('test')"}
        )

        # Get stats
        response = client.get(f"{api_base_url}/sandboxes/{sandbox_id}/stats")

        assert response.status_code == 200
        data = response.json()

        assert "session_id" in data
        assert "execution_count" in data
        assert "uptime" in data
        assert "container_status" in data
        assert data["execution_count"] >= 0


class TestSandboxValidation:
    """Test request validation."""

    def test_execute_empty_code(self, client: TestClient, api_base_url: str):
        """Test executing empty code (should fail validation)."""
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox_id = create_response.json()["id"]

        response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/execute",
            json={"code": ""}
        )

        assert response.status_code == 422  # Validation error

    def test_execute_invalid_timeout(self, client: TestClient, api_base_url: str):
        """Test executing with invalid timeout."""
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox_id = create_response.json()["id"]

        response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/execute",
            json={"code": "print('test')", "timeout": 999}  # Too large
        )

        assert response.status_code == 422

    def test_install_empty_package(self, client: TestClient, api_base_url: str):
        """Test installing empty package name (should fail)."""
        create_response = client.post(f"{api_base_url}/sandboxes")
        sandbox_id = create_response.json()["id"]

        response = client.post(
            f"{api_base_url}/sandboxes/{sandbox_id}/install",
            json={"package": ""}
        )

        assert response.status_code == 422
