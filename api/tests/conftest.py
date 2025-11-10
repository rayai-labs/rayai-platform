"""Pytest configuration and fixtures for integration tests."""

import os
from typing import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from dotenv import load_dotenv

from app.database.connection import get_db
from app.database.models import Base
from main import app

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)


@pytest.fixture(scope="session")
def test_db_url() -> str:
    """Get test database URL from environment."""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        pytest.skip("DATABASE_URL not set in environment")
    return db_url


@pytest.fixture(scope="session")
def test_engine(test_db_url: str):
    """Create test database engine."""
    engine = create_engine(test_db_url)
    yield engine
    engine.dispose()


@pytest.fixture(scope="session")
def test_session_factory(test_engine):
    """Create test session factory."""
    return sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db_session(test_session_factory) -> Generator[Session, None, None]:
    """Create a database session for a test."""
    session = test_session_factory()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """Create a test client with database session override."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def test_user_id() -> str:
    """Return the stub test user ID."""
    return "00000000-0000-0000-0000-000000000001"


@pytest.fixture
def api_base_url() -> str:
    """Return the API base URL."""
    return "/api/v1"
