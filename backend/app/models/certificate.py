from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, text
from sqlalchemy.orm import relationship
from app.database.session import Base

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_id = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    course_name = Column(String, nullable=False, default="Python Warrior — 12 Regions Mastery")
    issued_at = Column(DateTime(timezone=True), server_default=text('CURRENT_TIMESTAMP'))
    verified = Column(Boolean, default=True)

    user = relationship("User", back_populates="certificate")
