.PHONY: help install sync dev test format lint clean docker-build docker-run

help:
	@echo "Available commands:"
	@echo "  make install       - Install dependencies (alias for sync)"
	@echo "  make sync          - Sync dependencies with uv"
	@echo "  make dev           - Run development server with auto-reload"
	@echo "  make test          - Run tests"
	@echo "  make format        - Format code with black"
	@echo "  make lint          - Lint code with ruff"
	@echo "  make clean         - Clean up generated files"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-run    - Run Docker container"

install: sync

sync:
	uv sync

dev:
	uv run uvicorn main:app --reload --port 8000

test:
	uv run pytest -v

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
