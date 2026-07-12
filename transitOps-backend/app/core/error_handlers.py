from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.logging import logger
from app.core.exceptions import TransitOpsException
from app.utils.response import error_response

async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Handle standard HTTPExceptions and our custom TransitOpsException."""
    logger.error(f"HTTP Exception on {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(message=str(exc.detail)),
        headers=getattr(exc, "headers", None)
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle Pydantic validation errors."""
    logger.warning(f"Validation Error on {request.url.path}: {exc.errors()}")
    errors = [{"loc": err["loc"], "msg": err["msg"], "type": err["type"]} for err in exc.errors()]
    return JSONResponse(
        status_code=422,
        content=error_response(message="Validation Error", errors=errors)
    )

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    """Handle Database integrity or connection errors."""
    logger.exception(f"Database Error on {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=error_response(message="Internal Database Error")
    )

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle all other unhandled exceptions (500)."""
    logger.exception(f"Unhandled Exception on {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=error_response(message="Internal Server Error")
    )
