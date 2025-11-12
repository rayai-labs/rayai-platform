# API Integration Tests

Comprehensive integration tests for the RayAI Platform Sandbox API.

## Running Tests

### Run all tests
```bash
make test
```

### Run tests excluding slow ones (package installation tests)
```bash
make test-fast
```

### Run only integration tests
```bash
make test-integration
```

### Run with coverage report
```bash
make test-coverage
```

## Test Structure

### `test_sandbox_api.py`

Organized into test classes by functionality:

#### `TestSandboxLifecycle`
- `test_create_sandbox` - Create a new sandbox
- `test_list_sandboxes` - List all sandboxes
- `test_get_sandbox_by_id` - Get specific sandbox
- `test_get_nonexistent_sandbox` - 404 handling
- `test_start_sandbox` - Start a sandbox
- `test_stop_sandbox` - Stop a sandbox
- `test_delete_sandbox` - Delete a sandbox

#### `TestSandboxExecution`
- `test_execute_simple_code` - Execute basic Python
- `test_execute_with_calculation` - Math operations
- `test_execute_with_error` - Error handling
- `test_execute_with_timeout` - Custom timeout
- `test_execute_multiline_code` - Complex code

#### `TestSandboxPackages` (marked as slow)
- `test_install_package` - Install Python package
- `test_use_installed_package` - Use installed package

#### `TestSandboxFiles`
- `test_upload_file` - Upload file to sandbox
- `test_upload_and_read_file` - Upload and read back

#### `TestSandboxStats`
- `test_get_stats` - Get sandbox statistics

#### `TestSandboxValidation`
- `test_execute_empty_code` - Validation errors
- `test_execute_invalid_timeout` - Invalid parameters
- `test_install_empty_package` - Empty package name

## Fixtures

### `client` - FastAPI TestClient
Provides an HTTP client for making API requests.

### `active_sandbox` - Pre-created active sandbox
Many tests use this fixture to avoid duplicating setup code.

### `test_user_id` - Stub test user ID
The hardcoded test user ID used by stub authentication.

### `api_base_url` - Base API path
Returns `/api/v1` for building request URLs.

## Requirements

- Database must be running and seeded with test user
- **Docker Desktop must be installed and running** (for code execution, package installation, and file upload tests)
- Environment variable `DATABASE_URL` must be set
- Python dependencies must be synced with `make sync`

### Checking Docker Availability

Before running tests, verify Docker is properly configured:

```bash
make check-docker
```

This will verify:
- Docker Python package is installed
- Docker daemon is accessible
- ray-agents CodeInterpreterExecutor is available

## Test Markers

- `@pytest.mark.slow` - Slow tests (e.g., package installation)
- `@pytest.mark.integration` - Integration tests (could be added)
- `@pytest.mark.unit` - Unit tests (could be added)

## Coverage

Generate HTML coverage report:
```bash
make test-coverage
```

View report: `open htmlcov/index.html`

## CI/CD Integration

These tests are designed to run in CI pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: make test-fast  # Exclude slow tests in CI

- name: Run all tests
  run: make test  # Full suite for main branch
```

## Tips

1. **Isolate tests** - Each test creates its own sandbox
2. **Clean up** - Sandboxes are deleted after tests
3. **Mock external services** - For unit tests, consider mocking Ray
4. **Parallel execution** - Use `pytest-xdist` for faster runs

```bash
uv add pytest-xdist
pytest -n auto  # Run tests in parallel
```
