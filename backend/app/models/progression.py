from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base
import enum

class StatusEnum(enum.Enum):
    locked = "locked"
    available = "available"
    active = "active"
    completed = "completed"

class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(String, nullable=False, index=True)
    status = Column(String, default="locked") # 'locked', 'available', 'completed'
    completed_at = Column(DateTime(timezone=True), nullable=True)
    code_snapshot = Column(String, nullable=True)

    user = relationship("User", back_populates="lessons")

class RegionProgress(Base):
    __tablename__ = "region_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    region_id = Column(String, nullable=False, index=True)
    status = Column(String, default="locked") # 'locked', 'active', 'completed'
    boss_defeated = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="regions")

class AchievementProgress(Base):
    __tablename__ = "achievement_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(String, nullable=False, index=True)
    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="achievements")

class QuestProgress(Base):
    __tablename__ = "quest_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quest_id = Column(String, nullable=False, index=True)
    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="quests")

class KnowledgeGraph(Base):
    __tablename__ = "knowledge_graph"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    variables = Column(Integer, default=0)
    data_types = Column(Integer, default=0)
    loops = Column(Integer, default=0)
    functions = Column(Integer, default=0)
    collections = Column(Integer, default=0)
    oop = Column(Integer, default=0)
    exceptions = Column(Integer, default=0)
    files = Column(Integer, default=0)
    modules = Column(Integer, default=0)
    algorithms = Column(Integer, default=0)

    user = relationship("User", back_populates="knowledge_graph")

class TowerProgress(Base):
    __tablename__ = "tower_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    max_floor = Column(Integer, default=0)
    current_floor = Column(Integer, default=1)
    resonance = Column(Integer, default=0)
    
    user = relationship("User", back_populates="tower_progress")
