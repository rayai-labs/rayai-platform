.PHONY: help install sync dev test test-fast test-integration test-coverage format lint clean docker-build docker-run db-reset generate-schemas generate-python generate-typescript install-sqlc check-docker

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
	@echo "  make generate-schemas - Generate all schemas (Python + TypeScript)"
	@echo "  make generate-python  - Generate Python types with sqlc"
	@echo "  make generate-typescript - Generate TypeScript types for frontend"
	@echo "  make install-sqlc     - Install sqlc tool"
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

generate-schemas: generate-python generate-typescript
	@echo ""
	@echo "✅ All schema types generated successfully!"
	@echo ""
	@echo "📦 Generated files:"
	@echo "  - Python: api/app/database/generated/"
	@echo "  - TypeScript: app/src/lib/database.types.ts"
	@echo ""

generate-python:
	@echo "🐍 Generating Python types with sqlc..."
	@if ! command -v sqlc &> /dev/null; then \
		echo "❌ sqlc not found. Install with: make install-sqlc"; \
		exit 1; \
	fi
	@cd .. && sqlc generate
	@echo "✅ Python types generated in api/app/database/generated/"

generate-typescript:
	@echo "📘 Generating TypeScript types for frontend..."
	@if command -v npx &> /dev/null; then \
		cd ../app && npx supabase gen types typescript --local > src/lib/database.types.ts 2>/dev/null || \
		echo "⚠️  Note: Supabase CLI not available or not running locally. Skipping TypeScript generation."; \
	else \
		echo "⚠️  Note: npx not found. Skipping TypeScript generation."; \
	fi

install-sqlc:
	@echo "📦 Installing sqlc..."
	@if [[ "$$(uname -s)" == "Darwin" ]]; then \
		if command -v brew &> /dev/null; then \
			echo "Installing via Homebrew..."; \
			brew install sqlc; \
		else \
			echo "Installing via direct download (ARM64)..."; \
			curl -L https://github.com/sqlc-dev/sqlc/releases/download/v1.27.0/sqlc_1.27.0_darwin_arm64.tar.gz -o /tmp/sqlc.tar.gz; \
			tar -xzf /tmp/sqlc.tar.gz -C /tmp; \
			sudo mv /tmp/sqlc /usr/local/bin/; \
			rm /tmp/sqlc.tar.gz; \
		fi; \
	elif [[ "$$(uname -s)" == "Linux" ]]; then \
		echo "Installing for Linux..."; \
		curl -L https://github.com/sqlc-dev/sqlc/releases/download/v1.27.0/sqlc_1.27.0_linux_amd64.tar.gz -o /tmp/sqlc.tar.gz; \
		tar -xzf /tmp/sqlc.tar.gz -C /tmp; \
		sudo mv /tmp/sqlc /usr/local/bin/; \
		rm /tmp/sqlc.tar.gz; \
	else \
		echo "❌ Unsupported OS. Please install sqlc manually: https://docs.sqlc.dev/en/latest/overview/install.html"; \
		exit 1; \
	fi
	@echo "✅ sqlc installed successfully!"
	@sqlc version

check-docker:
	@echo "🐳 Checking Docker availability..."
	@uv run python scripts/check_docker.py
