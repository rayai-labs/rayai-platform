# RayAI Platform API

FastAPI backend for managing sandboxes orchestrated by [ray-agents](https://github.com/ray-project/ray-agents) code interpreter.

## Overview

This API provides endpoints for creating and managing isolated Python execution environments (sandboxes) using Ray's code interpreter. Key features:

- **Isolated Execution**: Each sandbox runs in a separate Docker container with gVisor (runsc) security
- **Stateful Sessions**: Code execution state persists across requests within a sandbox
- **Multi-tenant**: User isolation via Supabase authentication and RLS policies
- **Thin Orchestration Layer**: All sandbox orchestration delegated to ray-agents library

## Architecture

```
┌─────────────────┐
│  FastAPI Layer  │  ← Thin layer: Auth, DB CRUD, passthrough to ray-agents
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   ray-agents    │  ← ALL orchestration: Ray actors, Docker, state management
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Docker + gVisor │  ← Isolated execution environment
└─────────────────┘
```

## Prerequisites

- **Python 3.12+**
- **Docker Desktop** with gVisor runtime (runsc)
- **Supabase** project with database migrations applied
- **Ray cluster** (optional - local instance used if not specified)

## Installation

### 1. Install Dependencies

```bash
cd api

# Using uv (recommended)
uv sync

# Or using make
make install
```

### 2. Setup gVisor (macOS)

gVisor provides secure sandboxing for Docker containers:

```bash
# Install gVisor
brew install --cask docker
docker run --rm --runtime=runsc hello-world || {
    echo "Installing gVisor..."
    # Add gVisor runtime to Docker Desktop
    # Restart Docker Desktop after installation
}
```

For Linux servers:
```bash
sudo apt-get update && sudo apt-get install -y runsc
sudo runsc install
docker run --rm --runtime=runsc hello-world
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres

# Ray Configuration (leave empty for local instance)
RAY_ADDRESS=

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development
```

**Getting Supabase Credentials:**
- `SUPABASE_URL`: Project Settings → API → Project URL
- `SUPABASE_KEY`: Project Settings → API → service_role key
- `SUPABASE_JWT_SECRET`: Project Settings → API → JWT Settings → JWT Secret

## Running the API

### Development Mode

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

All endpoints require authentication via Supabase JWT token in the `Authorization` header:

```
Authorization: Bearer <supabase_jwt_token>
```

### Sandbox Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/sandboxes` | Create a new sandbox |
| GET | `/api/v1/sandboxes` | List all user's sandboxes |
| GET | `/api/v1/sandboxes/{id}` | Get sandbox details |
| POST | `/api/v1/sandboxes/{id}/start` | Start sandbox |
| POST | `/api/v1/sandboxes/{id}/stop` | Stop sandbox |
| DELETE | `/api/v1/sandboxes/{id}` | Delete sandbox |

### Sandbox Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/sandboxes/{id}/execute` | Execute Python code |
| POST | `/api/v1/sandboxes/{id}/install` | Install pip package |
| POST | `/api/v1/sandboxes/{id}/upload` | Upload file |
| GET | `/api/v1/sandboxes/{id}/stats` | Get session stats |

## Usage Examples

### 1. Create a Sandbox

```bash
curl -X POST http://localhost:8000/api/v1/sandboxes \
  -H "Authorization: Bearer $SUPABASE_TOKEN" \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "456e7890-e89b-12d3-a456-426614174000",
  "status": "stopped",
  "created_at": "2025-11-09T12:00:00Z",
  "updated_at": "2025-11-09T12:00:00Z"
}
```

### 2. Start the Sandbox

```bash
curl -X POST http://localhost:8000/api/v1/sandboxes/{sandbox_id}/start \
  -H "Authorization: Bearer $SUPABASE_TOKEN"
```

### 3. Execute Code

```bash
curl -X POST http://localhost:8000/api/v1/sandboxes/{sandbox_id}/execute \
  -H "Authorization: Bearer $SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello, World!\")",
    "timeout": 30
  }'
```

Response:
```json
{
  "status": "success",
  "stdout": "Hello, World!\n",
  "stderr": "",
  "exit_code": 0,
  "execution_id": "exec_123"
}
```

### 4. Install a Package

```bash
curl -X POST http://localhost:8000/api/v1/sandboxes/{sandbox_id}/install \
  -H "Authorization: Bearer $SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "package": "numpy==1.24.0"
  }'
```

### 5. Execute Code with Installed Package

State persists between executions:

```bash
curl -X POST http://localhost:8000/api/v1/sandboxes/{sandbox_id}/execute \
  -H "Authorization: Bearer $SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import numpy as np\nprint(np.array([1,2,3]).mean())"
  }'
```

### 6. Upload a File

```bash
# Create base64-encoded content
CONTENT=$(echo "data,value\n1,100\n2,200" | base64)

curl -X POST http://localhost:8000/api/v1/sandboxes/{sandbox_id}/upload \
  -H "Authorization: Bearer $SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"path\": \"/tmp/data.csv\",
    \"content\": \"$CONTENT\"
  }"
```

### 7. Get Session Statistics

```bash
curl http://localhost:8000/api/v1/sandboxes/{sandbox_id}/stats \
  -H "Authorization: Bearer $SUPABASE_TOKEN"
```

Response:
```json
{
  "session_id": "user-123-sandbox-456",
  "execution_count": 5,
  "created_at": "2025-11-09T12:00:00Z",
  "uptime": 120.5,
  "container_status": "running"
}
```

### 8. Stop and Delete

```bash
# Stop the sandbox
curl -X POST http://localhost:8000/api/v1/sandboxes/{sandbox_id}/stop \
  -H "Authorization: Bearer $SUPABASE_TOKEN"

# Delete the sandbox
curl -X DELETE http://localhost:8000/api/v1/sandboxes/{sandbox_id} \
  -H "Authorization: Bearer $SUPABASE_TOKEN"
```

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `201`: Created
- `204`: No Content (successful deletion)
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (invalid/missing JWT token)
- `403`: Forbidden (not authorized to access resource)
- `404`: Not Found
- `500`: Internal Server Error

Error response format:
```json
{
  "detail": "Error message here"
}
```

## Development

### Project Structure

```
api/
├── main.py                 # FastAPI app entry point
├── app/
│   ├── config.py          # Settings management
│   ├── database/
│   │   ├── models.py      # SQLAlchemy models
│   │   └── connection.py  # DB session management
│   ├── routes/
│   │   └── sandboxes.py   # API endpoints
│   ├── services/
│   │   └── sandbox_service.py  # Business logic (thin layer)
│   ├── middleware/
│   │   └── auth.py        # JWT authentication
│   └── schemas/
│       └── sandbox.py     # Pydantic models
├── requirements.txt       # Python dependencies
├── pyproject.toml        # Package configuration
└── README.md             # This file
```

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black .
ruff check .
```

## Deployment

### Docker

```bash
docker build -t rayai-platform-api .
docker run -p 8000:8000 --env-file .env rayai-platform-api
```

### Ray Cluster

For production, connect to an existing Ray cluster:

```bash
# Set in .env
RAY_ADDRESS=ray://your-ray-cluster:10001
```

## Security Considerations

1. **gVisor Runtime**: Sandboxes run with gVisor (runsc) for enhanced isolation
2. **Resource Limits**: Each sandbox limited to 512MB RAM, 1 CPU
3. **Timeouts**: 30s default execution timeout, 1hr session timeout
4. **RLS Policies**: Database enforces user isolation via Supabase RLS
5. **JWT Authentication**: All endpoints require valid Supabase JWT tokens

## Troubleshooting

### Ray not connecting

```bash
# Check if Ray is initialized
python -c "import ray; ray.init(); print(ray.is_initialized())"
```

### gVisor not working

```bash
# Verify gVisor runtime
docker run --rm --runtime=runsc hello-world

# If fails, restart Docker Desktop
```

### Database connection issues

```bash
# Test database connection
python -c "from app.database.connection import engine; print(engine.connect())"
```

## Contributing

1. Keep the service layer THIN - delegate all orchestration to ray-agents
2. Follow the existing code structure
3. Add tests for new endpoints
4. Update this README for new features

## License

MIT

## Support

For issues and questions:
- API Issues: Open an issue in this repository
- ray-agents Issues: https://github.com/ray-project/ray-agents/issues
