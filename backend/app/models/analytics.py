from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text, text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    event_type = Column(String, index=True, nullable=False)
    details = Column(Text, nullable=True)  # JSON-encoded string for flexible parameters
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")

class LessonFeedback(Base):
    __tablename__ = "lesson_feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    region_id = Column(String, nullable=False, index=True)
    lesson_id = Column(String, nullable=False, index=True)
    helpful = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")

class BugReport(Base):
    __tablename__ = "bug_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False, index=True)  # 'lesson', 'content', 'ui'
    description = Column(Text, nullable=False)
    context_info = Column(Text, nullable=True)  # e.g., URL or system details
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")

class BetaFeedback(Base):
    __tablename__ = "beta_feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    feedback_type = Column(String, nullable=False, index=True)  # 'bug', 'feature_request', 'content', 'general'
    description = Column(Text, nullable=False)
    context_info = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")

class ExitSurveyResponse(Base):
    __tablename__ = "exit_survey_responses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reason = Column(String, nullable=False)  # e.g., 'Too difficult', 'Too easy', etc.
    details = Column(Text, nullable=True)
    context = Column(String, nullable=False)  # 'registration', 'first_lesson', 'first_region'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
