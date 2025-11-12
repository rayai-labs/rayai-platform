"""FastAPI application entry point."""

import ray
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import sandboxes
from app.middleware.exception_handler import ExceptionHandler

# Create FastAPI app
app = FastAPI(
    title="RayAI Platform API",
    description="FastAPI backend for sandbox orchestration using Ray code interpreter",
    version="1.0.0",
)

# CORS middleware - adjust origins for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize Ray cluster connection on application startup."""
    if settings.ray_address:
        # Connect to existing Ray cluster (production)
        ray.init(address=settings.ray_address, ignore_reinit_error=True)
        print(f"Connected to Ray cluster at {settings.ray_address}")
    else:
        # Start local Ray instance (development)
        # Note: When using 'uv run', workers inherit the same environment automatically.
        # The docker package from pyproject.toml will be available to Ray workers.
        ray.init(ignore_reinit_error=True, num_cpus=4)
        print("Started local Ray instance")

    print(f"Ray initialized: {ray.is_initialized()}")
    print(f"Ray cluster resources: {ray.cluster_resources()}")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown Ray connection on application shutdown."""
    if ray.is_initialized():
        ray.shutdown()
        print("Ray shutdown complete")


# Include routers
app.include_router(sandboxes.router, prefix="/api/v1", tags=["sandboxes"])


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "ray_initialized": ray.is_initialized(),
        "environment": settings.environment,
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "RayAI Platform API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


# HTTP exception handler for consistent error responses
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent formatting."""
    return await ExceptionHandler.http_exception_handler(request, exc)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle uncaught exceptions."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error": str(exc) if settings.environment == "development" else None,
        },
    )
