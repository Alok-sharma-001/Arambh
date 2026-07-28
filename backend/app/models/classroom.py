from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, text
from sqlalchemy.orm import relationship
from app.database.session import Base

class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    join_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=text('CURRENT_TIMESTAMP'))

    teacher = relationship("User", foreign_keys=[teacher_id])
    members = relationship("ClassroomMember", back_populates="classroom")

class ClassroomMember(Base):
    __tablename__ = "classroom_members"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    joined_at = Column(DateTime(timezone=True), server_default=text('CURRENT_TIMESTAMP'))

    classroom = relationship("Classroom", back_populates="members")
    student = relationship("User", foreign_keys=[student_id])
