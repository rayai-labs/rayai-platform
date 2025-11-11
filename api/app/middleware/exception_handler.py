"""Generic exception handling middleware for consistent API responses."""

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse


class ExceptionHandler:
    """Handle HTTP exceptions with consistent response format."""
    
    @staticmethod
    async def http_exception_handler(request: Request, exc: HTTPException):
        """Handle HTTP exceptions with consistent error format.
        
        Provides consistent error responses for all HTTP exceptions,
        with special handling for authentication errors.
        """
        if exc.status_code == 401:
            return JSONResponse(
                status_code=401,
                content={
                    "error": "Authentication failed",
                    "detail": exc.detail,
                    "type": "auth_error"
                }
            )
        
        if exc.status_code == 403:
            return JSONResponse(
                status_code=403,
                content={
                    "error": "Access forbidden",
                    "detail": exc.detail,
                    "type": "authorization_error"
                }
            )
        
        if exc.status_code == 404:
            return JSONResponse(
                status_code=404,
                content={
                    "error": "Resource not found",
                    "detail": exc.detail,
                    "type": "not_found_error"
                }
            )
        
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": "Request failed",
                "detail": exc.detail,
                "type": "http_error"
            }
        )