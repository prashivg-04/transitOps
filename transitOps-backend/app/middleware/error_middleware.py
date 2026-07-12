from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.logging import logger
from app.utils.response import error_response

class ErrorMiddleware(BaseHTTPMiddleware):
    """Catch-all middleware for errors that slip past exception handlers."""
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            logger.exception(f"Middleware Caught Unhandled Exception: {str(exc)}")
            return JSONResponse(
                status_code=500,
                content=error_response(message="An unexpected error occurred processing the request.")
            )
