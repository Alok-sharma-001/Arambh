from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime

from app.database.session import Base

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    hashed_otp = Column(String, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
