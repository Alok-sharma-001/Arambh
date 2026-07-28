import secrets
import logging
from pydantic_settings import BaseSettings
from typing import Optional

logger = logging.getLogger(__name__)

# Fail-loud fallback — obvious in production that .env is not configured
_DEFAULT_SECRET = "INSECURE-DEV-ONLY-CHANGE-ME-IN-PRODUCTION"

class Settings(BaseSettings):
    ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./arambh.db"
    SECRET_KEY: str = _DEFAULT_SECRET
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    JWT_SECRET: Optional[str] = None
    JWT_ALGORITHM: Optional[str] = "HS256"
    JWT_EXPIRE_MINUTES: Optional[int] = 10080
    COOKIE_SECURE: Optional[bool] = False

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Warn or fail if using insecure default SECRET_KEY
if settings.SECRET_KEY == _DEFAULT_SECRET:
    if settings.ENV == "production":
        raise RuntimeError("FATAL: SECRET_KEY must be set in .env for production!")
    logger.warning(
        "⚠️  SECRET_KEY not set in .env — using INSECURE default! "
        "This is acceptable for local development but MUST be changed for production. "
        "Set SECRET_KEY in your .env file."
    )

