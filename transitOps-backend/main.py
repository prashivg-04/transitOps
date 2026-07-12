import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError
from contextlib import asynccontextmanager
from sqlalchemy import text

from app.core.config import settings
from app.database import engine, Base
from app.routers import (
    auth, users, vehicles, drivers, trips, 
    maintenance, fuel_logs, expenses, dashboard, reports
)
from app.core.logging import setup_logging, logger
from app.core.error_handlers import (
    http_exception_handler,
    validation_exception_handler,
    sqlalchemy_exception_handler,
    global_exception_handler
)
from app.core.exceptions import TransitOpsException
from app.middleware.request_logger import RequestLoggerMiddleware
from app.middleware.error_middleware import ErrorMiddleware

START_TIME = time.time()

# Tracks whether the DB was reachable at the last startup attempt.
# Updated by the lifespan handler; read by /health.
_db_status: str = "unreachable"

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _db_status

    # Logging
    setup_logging()
    logger.info("Starting TransitOps API...")

    # Database schema initialisation (non-fatal)
    logger.info("Attempting database schema initialisation...")
    try:
        Base.metadata.create_all(bind=engine)
        _db_status = "ok"
        logger.info("Database schema initialised successfully.")
    except Exception as exc:
        _db_status = "unreachable"
        logger.error(
            f"Database unavailable at startup — application will continue without DB. "
            f"Error: {exc}"
        )
        logger.warning(
            "Swagger (/docs), ReDoc (/redoc), and /health remain accessible. "
            "All data endpoints will fail until the database is reachable."
        )

    yield

    # Shutdown
    logger.info("Shutting down TransitOps API.")

app = FastAPI(
    title="TransitOps API",
    description="Smart Transport Operations Platform Backend.",
    version="1.0.0",
    lifespan=lifespan,
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Exception Handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(TransitOpsException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Middlewares (Order matters: outermost first)
app.add_middleware(ErrorMiddleware)
app.add_middleware(RequestLoggerMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/health", tags=["Health"])
def health_check():
    """Returns application liveness and last-known database reachability."""
    uptime = time.time() - START_TIME

    # Re-probe the database on every call so the status reflects current state.
    db_status = "ok"
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as exc:
        logger.warning(f"Health-check DB probe failed: {exc}")
        db_status = "unreachable"

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "version": app.version,
        "database_connection": db_status,
        "application_uptime_seconds": round(uptime, 2),
    }


# Register Routers under /api/v1 prefix
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(vehicles.router, prefix="/api/v1")
app.include_router(drivers.router, prefix="/api/v1")
app.include_router(trips.router, prefix="/api/v1")
app.include_router(maintenance.router, prefix="/api/v1")
app.include_router(fuel_logs.router, prefix="/api/v1")
app.include_router(expenses.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
