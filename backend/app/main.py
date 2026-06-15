import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect
from sqlalchemy.exc import SQLAlchemyError

from app.auth.router import router as auth_router
from app.api.progress import router as progress_router
from app.api.endpoints import progression, sync, guild
from app.database.session import engine, Base
import app.models  # This ensures the __init__.py is loaded

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    logger.info("Starting up application...")
    try:
        registered_tables = list(Base.metadata.tables.keys())
        logger.info(f"Registered metadata tables: {registered_tables}")
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        logger.info("Successfully executed Base.metadata.create_all()")
        
        # Verify in DB
        inspector = inspect(engine)
        actual_tables = inspector.get_table_names()
        logger.info(f"Actual tables in PostgreSQL: {actual_tables}")
        
        if "users" in actual_tables:
            logger.info("Verified: 'users' table exists.")
        else:
            logger.error("Error: 'users' table was NOT created.")
            
        # Ensure new RPG columns exist in user_stats
        from sqlalchemy import text
        with engine.begin() as conn:
            try:
                conn.execute(text("ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS player_class VARCHAR;"))
                conn.execute(text("ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS rank VARCHAR DEFAULT 'Novice';"))
                conn.execute(text("ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS title VARCHAR;"))
                logger.info("Database migration: Verified/Added missing RPG columns to user_stats.")
            except Exception as e:
                logger.warning(f"Database migration for user_stats failed: {e}")
            
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        
    yield
    # Shutdown event
    logger.info("Shutting down application...")

app = FastAPI(title="Arambh API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(progress_router, prefix="/api")
app.include_router(progression.router, prefix="/api/progression", tags=["progression"])
app.include_router(sync.router, prefix="/api/v1/sync", tags=["sync"])
app.include_router(guild.router, prefix="/api/v1/guilds", tags=["guilds"])

@app.get("/")
async def root():
    return {"message": "Welcome to Arambh API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/diag/db-status")
async def db_status():
    status = {
        "database_connected": False,
        "dialect": engine.dialect.name,
        "registered_metadata_tables": list(Base.metadata.tables.keys()),
        "actual_database_tables": [],
        "error": None
    }
    
    try:
        # Check connection
        with engine.connect() as connection:
            status["database_connected"] = True
            
        # Get actual tables
        inspector = inspect(engine)
        status["actual_database_tables"] = inspector.get_table_names()
        
    except Exception as e:
        status["error"] = str(e)
        
    return status
