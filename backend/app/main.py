import logging
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from app.database.session import engine, Base
from app.core.config import settings

# CRITICAL: Import all models via the models package to ensure registration in Base.metadata
import app.models

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

from app.auth.router import router as auth_router
from app.api.progress import router as progress_router

def init_db():
    """
    Initializes the database schema by creating all tables registered in metadata.
    """
    try:
        # Masked DATABASE_URL logging
        db_url = settings.DATABASE_URL
        masked_host = db_url.split("@")[-1] if "@" in db_url else "configured"
        logger.info(f"DB INIT: Connecting to host: {masked_host}")

        # Log registered models
        registered_tables = list(Base.metadata.tables.keys())
        logger.info(f"DB INIT: Models registered in metadata: {registered_tables}")

        if not registered_tables:
            logger.warning("DB INIT: No tables registered in metadata! Schema creation will do nothing.")

        # Create tables
        logger.info("DB INIT: Running Base.metadata.create_all(bind=engine)...")
        Base.metadata.create_all(bind=engine)

        # Verify existing tables
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        logger.info(f"DB INIT: Tables detected in database: {existing_tables}")

        if 'users' in existing_tables:
            logger.info("DB INIT: Initialization successful. 'users' table exists.")
        else:
            logger.error("DB INIT: CRITICAL ERROR - 'users' table still missing after create_all!")

    except Exception as e:
        logger.error(f"DB INIT: Failed during initialization: {e}")

# Diagnostics Router
diag_router = APIRouter(prefix="/diag", tags=["diagnostics"])

@diag_router.get("/db-status")
async def get_db_status():
    status = {
        "database_connected": False,
        "dialect": engine.name,
        "registered_metadata_tables": list(Base.metadata.tables.keys()),
        "actual_database_tables": [],
        "error": None
    }
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            status["database_connected"] = True

        inspector = inspect(engine)
        status["actual_database_tables"] = inspector.get_table_names()
    except Exception as e:
        status["error"] = str(e)

    return status

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure DB is initialized before serving requests
    init_db()
    yield

app = FastAPI(
    title="Arambh API",
    version="0.1.3",
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
app.include_router(diag_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Welcome to Arambh API",
        "status": "online",
        "version": "0.1.3"
    }

@app.get("/health")
async def health_check():
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        if "users" in tables:
            return {"status": "healthy", "tables_count": len(tables)}
        return {"status": "degraded", "error": "schema missing"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
