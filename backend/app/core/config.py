from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # DATABASE_URL is required in production (Render)
    # Using a placeholder for development if not set in .env
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Startup logging (defensive)
db_url_log = settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else "configured"
print(f"DATABASE_URL host: {db_url_log}")
