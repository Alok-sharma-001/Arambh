import secrets
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User, UserStats
from app.models.classroom import Classroom, ClassroomMember
from app.models.progression import RegionProgress

router = APIRouter(prefix="/classroom", tags=["classroom"])

class CreateClassroomRequest(BaseModel):
    name: str

class JoinClassroomRequest(BaseModel):
    join_code: str

class StudentRosterItem(BaseModel):
    student_id: int
    username: str
    level: int
    total_xp: int
    completed_regions_count: int

class ClassroomDetailsResponse(BaseModel):
    id: int
    name: str
    join_code: str
    is_teacher: bool
    student_count: int
    roster: List[StudentRosterItem]

@router.post("/create", response_model=ClassroomDetailsResponse)
def create_classroom(
    req: CreateClassroomRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    join_code = f"CLASS-{secrets.token_hex(2).upper()}"
    cls = Classroom(
        name=req.name,
        join_code=join_code,
        teacher_id=current_user.id
    )
    db.add(cls)
    db.commit()
    db.refresh(cls)

    return ClassroomDetailsResponse(
        id=cls.id,
        name=cls.name,
        join_code=cls.join_code,
        is_teacher=True,
        student_count=0,
        roster=[]
    )

@router.post("/join")
def join_classroom(
    req: JoinClassroomRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cls = db.query(Classroom).filter(Classroom.join_code == req.join_code.strip().upper()).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Invalid classroom code.")

    if cls.teacher_id == current_user.id:
        raise HTTPException(status_code=400, detail="Teacher cannot join their own classroom as a student.")

    existing_mem = db.query(ClassroomMember).filter(
        ClassroomMember.classroom_id == cls.id,
        ClassroomMember.student_id == current_user.id
    ).first()

    if not existing_mem:
        mem = ClassroomMember(classroom_id=cls.id, student_id=current_user.id)
        db.add(mem)
        db.commit()

    return {"status": "success", "classroom_name": cls.name, "join_code": cls.join_code}

@router.get("/my-class", response_model=List[ClassroomDetailsResponse])
def get_my_classrooms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Classrooms where user is teacher
    teacher_classes = db.query(Classroom).filter(Classroom.teacher_id == current_user.id).all()
    
    # Classrooms where user is student
    student_mems = db.query(ClassroomMember).filter(ClassroomMember.student_id == current_user.id).all()
    student_class_ids = [m.classroom_id for m in student_mems]
    student_classes = db.query(Classroom).filter(Classroom.id.in_(student_class_ids)).all() if student_class_ids else []

    all_classes = list({c.id: c for c in (teacher_classes + student_classes)}.values())
    res = []

    for c in all_classes:
        is_teacher = (c.teacher_id == current_user.id)
        members = db.query(ClassroomMember).filter(ClassroomMember.classroom_id == c.id).all()
        student_ids = [m.student_id for m in members]

        roster = []
        if is_teacher and student_ids:
            students = db.query(User).filter(User.id.in_(student_ids)).all()
            for s in students:
                lvl = s.stats.current_level if s.stats else 1
                xp = s.stats.total_xp if s.stats else 0
                completed_regions = db.query(RegionProgress).filter(
                    RegionProgress.user_id == s.id,
                    RegionProgress.status == "completed"
                ).count()
                roster.append(StudentRosterItem(
                    student_id=s.id,
                    username=s.username,
                    level=lvl,
                    total_xp=xp,
                    completed_regions_count=completed_regions
                ))

        res.append(ClassroomDetailsResponse(
            id=c.id,
            name=c.name,
            join_code=c.join_code,
            is_teacher=is_teacher,
            student_count=len(members),
            roster=roster
        ))

    return res
