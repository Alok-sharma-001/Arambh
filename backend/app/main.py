import os
import sentry_sdk
if os.getenv('SENTRY_DSN'):
    sentry_sdk.init(dsn=os.getenv('SENTRY_DSN'), traces_sample_rate=0.1)

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import inspect, text
from sqlalchemy.exc import SQLAlchemyError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.auth.router import router as auth_router
from app.api.endpoints import progression, sync, guild, revisions, mentor, analytics, payments, quests, achievements, certificates, classroom, password_reset
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
        
        # Tables are managed by Alembic migrations — do NOT use create_all()
        # Verify tables exist in DB
        inspector = inspect(engine)
        actual_tables = inspector.get_table_names()
        logger.info(f"Actual database tables: {actual_tables}")
            
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        
    yield
    # Shutdown event
    logger.info("Shutting down application...")

app = FastAPI(title="Arambh API", version="0.1.0", lifespan=lifespan)

from app.core.limiter import limiter

# Exception Handling
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://arambh-beige.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(progression.router, prefix="/api/progression", tags=["progression"])
app.include_router(sync.router, prefix="/api/v1/sync", tags=["sync"])
app.include_router(guild.router, prefix="/api/v1/guilds", tags=["guilds"])
app.include_router(revisions.router, prefix="/api/v1/revisions", tags=["revisions"])
app.include_router(mentor.router, prefix="/api/v1/mentor", tags=["mentor"])
app.include_router(analytics.router, prefix="/api", tags=["analytics"])
app.include_router(payments.router, prefix="/api", tags=["payments"])
app.include_router(quests.router, prefix="/api", tags=["quests"])
app.include_router(achievements.router, prefix="/api", tags=["achievements"])
app.include_router(certificates.router, prefix="/api", tags=["certificates"])
app.include_router(classroom.router, prefix="/api", tags=["classroom"])
app.include_router(password_reset.router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Welcome to Arambh API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

from app.auth.router import get_current_user
from app.models.user import User
from fastapi import Depends

@app.get("/api/diag/db-status")
async def db_status(current_user: User = Depends(get_current_user)):
    if current_user.username not in ("admin", "founder"):
        raise HTTPException(status_code=403, detail="Access denied.")
        
    status = {
        "database_connected": False,
        "dialect": engine.dialect.name,
        "registered_metadata_tables": list(Base.metadata.tables.keys()),
        "actual_database_tables": [],
        "user_stats_columns": [],
        "alembic_version": None,
        "error": None
    }
    
    try:
        # Check connection
        with engine.connect() as connection:
            status["database_connected"] = True
            
        # Get actual tables
        inspector = inspect(engine)
        status["actual_database_tables"] = inspector.get_table_names()
        if "user_stats" in status["actual_database_tables"]:
            status["user_stats_columns"] = [c["name"] for c in inspector.get_columns("user_stats")]
            
        # Query alembic version
        if "alembic_version" in status["actual_database_tables"]:
            with engine.connect() as connection:
                res = connection.execute(text("SELECT version_num FROM alembic_version")).fetchone()
                status["alembic_version"] = res[0] if res else None
        
    except Exception as e:
        status["error"] = str(e)
        
    return status
