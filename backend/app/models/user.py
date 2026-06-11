from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    stats = relationship("UserStats", back_populates="user", uselist=False)
    inventory = relationship("InventoryItem", back_populates="user")
    spaced_repetition = relationship("SpacedRepetition", back_populates="user")
    challenge_progress = relationship("ChallengeProgress", back_populates="user")

class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    current_level = Column(Integer, default=1)
    total_xp = Column(Integer, default=0)
    intelligence_stat = Column(Integer, default=10)
    streak_days = Column(Integer, default=0)
    
    # RPG Progression
    player_class = Column(String, nullable=True)
    rank = Column(String, default="Novice")
    title = Column(String, nullable=True)

    user = relationship("User", back_populates="stats")

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    item_id = Column(String, nullable=False) # e.g., "variables_crystal"
    acquired_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="inventory")

class SpacedRepetition(Base):
    __tablename__ = "spaced_repetition"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_name = Column(String, nullable=False)
    interval_days = Column(Integer, default=1)
    ease_factor = Column(Float, default=2.5)
    next_review_date = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="spaced_repetition")

class ChallengeProgress(Base):
    __tablename__ = "challenge_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    challenge_id = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    attempts = Column(Integer, default=0)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="challenge_progress")
