"""Pytest configuration and fixtures for integration tests."""

import os
from pathlib import Path
from typing import Generator

import pytest
import ray
from fastapi.testclient import TestClient
from dotenv import load_dotenv

from main import app

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)


@pytest.fixture(scope="session", autouse=True)
def setup_ray():
    """Initialize Ray for the test session."""
    if not ray.is_initialized():
        ray.init(ignore_reinit_error=True, num_cpus=4)
        print("Started local Ray instance")
        print(f"Ray initialized: {ray.is_initialized()}")
        print(f"Ray cluster resources: {ray.cluster_resources()}")

    yield

    ray.shutdown()
    print("Ray shutdown complete")


@pytest.fixture(scope="function")
def client() -> Generator[TestClient, None, None]:
    """Create a test client."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def test_user_id() -> str:
    """Return the stub test user ID."""
    return "00000000-0000-0000-0000-000000000001"


@pytest.fixture
def api_base_url() -> str:
    """Return the API base URL."""
    return "/api/v1"
