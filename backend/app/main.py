from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.router import router as auth_router
from app.api.progress import router as progress_router
from app.database.session import engine, Base
from app.core.config import settings
import logging
from sqlalchemy import inspect

# Explicitly import models to ensure they are registered with Base.metadata
from app.models.user import User, UserStats, SpacedRepetition, ChallengeProgress

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    try:
        # Masked DATABASE_URL logging
        db_host = settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else "configured"
        logger.info(f"Connecting to database at host: {db_host}")

        logger.info("Initializing database tables via Base.metadata.create_all...")
        Base.metadata.create_all(bind=engine)

        # Verify tables
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        logger.info(f"Database tables detected: {existing_tables}")

        if 'users' not in existing_tables:
            logger.error("CRITICAL: 'users' table not found after initialization!")
        else:
            logger.info("Database schema verification passed.")

    except Exception as e:
        logger.error(f"Error during database initialization: {e}")

# Run initialization
init_db()

app = FastAPI(title="Arambh API", version="0.1.0")

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
    return {"message": "Welcome to Arambh API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
