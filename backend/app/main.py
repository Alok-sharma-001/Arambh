import logging
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect
from app.database.session import engine, Base
from app.core.config import settings

# Setup logging before anything else
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

# CRITICAL: Import all models so they are registered with Base.metadata
# These MUST be imported before any operations on Base.metadata
logger.info("Importing models for metadata registration...")
try:
    from app.models.user import User, UserStats, SpacedRepetition, ChallengeProgress
    logger.info(f"Models registered in metadata: {list(Base.metadata.tables.keys())}")
except Exception as e:
    logger.error(f"Failed to import models: {e}")

from app.auth.router import router as auth_router
from app.api.progress import router as progress_router

def verify_and_init_db():
    """
    Verifies the database connection, logs existing tables,
    and creates missing tables if necessary.
    """
    try:
        # Masked DATABASE_URL logging
        db_url = settings.DATABASE_URL
        masked_url = db_url.split("@")[-1] if "@" in db_url else "configured"
        logger.info(f"Database verification start. Target Host: {masked_url}")

        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        logger.info(f"Existing tables in database before init: {existing_tables}")

        # Check if critical table 'users' exists
        if 'users' not in existing_tables:
            logger.info("Table 'users' not found. Running Base.metadata.create_all(bind=engine)...")
            # This will create all tables defined in models that don't exist yet
            Base.metadata.create_all(bind=engine)

            # Re-inspect to verify
            updated_tables = inspect(engine).get_table_names()
            logger.info(f"Tables in database after init: {updated_tables}")

            if 'users' in updated_tables:
                logger.info("Database schema initialized successfully.")
            else:
                logger.error("CRITICAL: Schema initialization failed - 'users' table still missing!")
        else:
            logger.info("Database schema already verified (users table exists).")

    except Exception as e:
        logger.error(f"Database verification/initialization failed: {e}")

# Run initialization immediately on module load
verify_and_init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Secondary check on startup
    logger.info("Application lifespan starting...")
    verify_and_init_db()
    yield

app = FastAPI(
    title="Arambh API",
    version="0.1.2",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(progress_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Welcome to Arambh API",
        "status": "online",
        "version": "0.1.2"
    }

@app.get("/health")
async def health_check():
    health_info = {
        "status": "healthy",
        "database": "unknown",
        "tables": [],
        "models_registered": list(Base.metadata.tables.keys())
    }
    try:
        inspector = inspect(engine)
        health_info["tables"] = inspector.get_table_names()
        health_info["database"] = "connected"
        if "users" in health_info["tables"]:
            health_info["status"] = "healthy"
        else:
            health_info["status"] = "degraded"
            health_info["error"] = "users table missing"
    except Exception as e:
        health_info["status"] = "unhealthy"
        health_info["error"] = str(e)

    return health_info
