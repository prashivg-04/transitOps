from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

# ── Engine ────────────────────────────────────────────────────────────────────
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,   # recycle stale connections
    pool_size=10,
    max_overflow=20,
    echo=False,           # set True to see SQL in console during dev
)

# ── Session factory ───────────────────────────────────────────────────────────
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,   # avoids lazy-load after commit in async-style code
)


# ── Declarative base ──────────────────────────────────────────────────────────
class Base(DeclarativeBase):
    """Single shared metadata / mapper registry for the entire project."""
    pass


# ── FastAPI dependency ────────────────────────────────────────────────────────
def get_db() -> Generator[Session, None, None]:
    """
    Yield a SQLAlchemy session and guarantee it is closed after the request,
    even if an exception is raised.
    """
    db: Session = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


# ── Health-check helper ───────────────────────────────────────────────────────
def check_db_connection() -> bool:
    """Return True if the database is reachable."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
