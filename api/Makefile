.PHONY: help install sync dev test test-fast test-integration test-coverage format lint clean docker-build docker-run db-reset gen-types check-docker

help:
	@echo "Available commands:"
	@echo "  make install          - Install dependencies (alias for sync)"
	@echo "  make sync             - Sync dependencies with uv"
	@echo "  make dev              - Run development server with auto-reload"
	@echo "  make test             - Run all tests"
	@echo "  make test-fast        - Run tests excluding slow tests"
	@echo "  make test-integration - Run integration tests only"
	@echo "  make test-coverage    - Run tests with coverage report"
	@echo "  make format           - Format code with black"
	@echo "  make lint             - Lint code with ruff"
	@echo "  make clean            - Clean up generated files"
	@echo "  make db-reset         - Reset Supabase database and regenerate types"
	@echo "  make gen-types        - Generate Pydantic types from Supabase schema"
	@echo "  make check-docker     - Check Docker availability for tests"
	@echo "  make docker-build     - Build Docker image"
	@echo "  make docker-run       - Run Docker container"

install: sync

sync:
	uv sync

dev:
	uv run uvicorn main:app --reload --port 8000

test:
	uv run pytest -v

test-fast:
	uv run pytest -v -m "not slow"

test-integration:
	uv run pytest -v tests/test_sandbox_api.py

test-coverage:
	uv run pytest -v --cov=app --cov-report=term-missing --cov-report=html

format:
	uv run black .

lint:
	uv run ruff check .

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +

docker-build:
	docker build -t rayai-platform-api .

docker-run:
	docker run -p 8000:8000 --env-file .env rayai-platform-api

db-reset:
	@bash scripts/db_reset.sh

gen-types:
	@echo "🔧 Generating types from Supabase schema..."
	@uv run python scripts/generate_types.py

check-docker:
	@echo "🐳 Checking Docker availability..."
	@uv run python scripts/check_docker.py
