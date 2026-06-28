import enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base

class MentorConversation(Base):
    __tablename__ = "mentor_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    concept_id = Column(String, nullable=True, index=True)
    lesson_id = Column(String, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    
    user = relationship("User", back_populates="mentor_conversations")
    messages = relationship("MentorMessage", back_populates="conversation", cascade="all, delete-orphan")

class MentorMessage(Base):
    __tablename__ = "mentor_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("mentor_conversations.id"))
    role = Column(String, nullable=False)  # 'user', 'assistant'
    content = Column(Text, nullable=False)
    code_snapshot = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    conversation = relationship("MentorConversation", back_populates="messages")
