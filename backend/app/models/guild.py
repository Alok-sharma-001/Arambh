from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base

class Guild(Base):
    __tablename__ = "guilds"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    crest_id = Column(String, default="shield")
    level = Column(Integer, default=1)
    total_gxp = Column(Integer, default=0)
    reputation = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    members = relationship("GuildMember", back_populates="guild", cascade="all, delete-orphan")
    progress = relationship("GuildProgress", back_populates="guild", uselist=False, cascade="all, delete-orphan")

class GuildMember(Base):
    __tablename__ = "guild_members"

    id = Column(Integer, primary_key=True, index=True)
    guild_id = Column(Integer, ForeignKey("guilds.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    role = Column(String, default="recruit") # 'founder', 'officer', 'member', 'recruit'
    joined_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    contribution_gxp = Column(Integer, default=0)

    guild = relationship("Guild", back_populates="members")
    user = relationship("User", back_populates="guild_membership")

class GuildProgress(Base):
    __tablename__ = "guild_progress"

    id = Column(Integer, primary_key=True, index=True)
    guild_id = Column(Integer, ForeignKey("guilds.id"), nullable=False, unique=True)
    active_boss_id = Column(String, nullable=True)
    boss_health_remaining = Column(Integer, default=0)
    completed_bosses = Column(JSON, default=[]) # List of Strings
    active_quests = Column(JSON, default=[]) # List of Quest IDs

    guild = relationship("Guild", back_populates="progress")
