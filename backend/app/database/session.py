import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL

# Handle both SQLite (local testing) and PostgreSQL (Docker/Prod)
is_sqlite = db_url.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}
engine_kwargs = {"connect_args": connect_args}

if not is_sqlite:
    engine_kwargs.update({
        "pool_pre_ping": True,
        "pool_size": 10,
        "max_overflow": 20
    })

try:
    engine = create_engine(db_url, **engine_kwargs)
    # Test connection ping
    with engine.connect() as conn:
        pass
    logger.info("Successfully connected to primary database.")
except Exception as e:
    logger.warning(f"Could not connect to primary DATABASE_URL ({e}). Falling back to local SQLite database.")
    db_url = "sqlite:///./arambh.db"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Automatically create tables if using SQLite fallback
if db_url.startswith("sqlite"):
    from app.models import user, progression, analytics, mentor, classroom, certificate, password_reset, subscription  # noqa
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
