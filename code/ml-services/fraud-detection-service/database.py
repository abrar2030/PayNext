"""
Database session factory for the Fraud Detection Service.
Supports MySQL (production) with automatic SQLite fallback for local dev.
"""

import logging
import os

from models import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

_DB_URL = os.getenv(
    "DB_URL",
    "sqlite:///./fraud_detection_dev.db",  # SQLite fallback - no server needed locally
)

_connect_args = {"check_same_thread": False} if _DB_URL.startswith("sqlite") else {}

engine = create_engine(
    _DB_URL,
    connect_args=_connect_args,
    pool_pre_ping=True,  # drop stale connections before use
    pool_recycle=3600,  # recycle connections every hour
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    """Create all tables on first startup if they don't already exist."""
    Base.metadata.create_all(bind=engine)
    logger.info(
        "Database tables initialised (%s)", _DB_URL.split("@")[-1]
    )  # mask credentials


def get_db():
    """FastAPI dependency: yields a DB session and ensures it is closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
