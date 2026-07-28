from typing import List, Dict, Any
from pydantic import BaseModel
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User, UserStats
from app.models.progression import QuestProgress, LessonProgress
from app.api.endpoints.progression import calculate_level, calculate_rank

router = APIRouter(prefix="/quests", tags=["quests"])

QUEST_TEMPLATES = [
    {
        "id": "q1",
        "title": "Finish First Lesson",
        "description": "Complete your very first lesson in the Variables Forest.",
        "target": 1,
        "xpReward": 50,
        "difficulty": "Easy",
        "type": "lesson_count"
    },
    {
        "id": "q2",
        "title": "Complete Variables Module",
        "description": "Finish all 4 lessons in the Variables Forest.",
        "target": 4,
        "xpReward": 150,
        "difficulty": "Medium",
        "type": "variables_region"
    },
    {
        "id": "q3",
        "title": "Earn 500 XP",
        "description": "Accumulate a total of 500 experience points.",
        "target": 500,
        "xpReward": 100,
        "difficulty": "Medium",
        "type": "total_xp"
    },
    {
        "id": "q4",
        "title": "Maintain 3 Day Streak",
        "description": "Log in and learn for 3 consecutive days.",
        "target": 3,
        "xpReward": 100,
        "difficulty": "Easy",
        "type": "streak"
    },
    {
        "id": "q5",
        "title": "Master of Loops",
        "description": "Complete all 4 lessons in the Loops Desert.",
        "target": 4,
        "xpReward": 300,
        "difficulty": "Epic",
        "type": "loops_region"
    }
]

class QuestResponse(BaseModel):
    id: str
    title: str
    description: str
    progress: int
    target: int
    xpReward: int
    difficulty: str
    completed: bool
    claimed: bool

class ClaimQuestRequest(BaseModel):
    quest_id: str

@router.get("/active", response_model=List[QuestResponse])
def get_active_quests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = current_user.stats
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        db.commit()

    completed_lessons = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.status == "completed"
    ).all()
    completed_lesson_ids = {l.lesson_id for l in completed_lessons}

    quests_out = []
    for tmpl in QUEST_TEMPLATES:
        q_id = tmpl["id"]
        
        # Calculate progress dynamically based on real user activity
        if tmpl["type"] == "lesson_count":
            current_prog = len(completed_lesson_ids)
        elif tmpl["type"] == "variables_region":
            vars_lessons = {"v1", "v2", "v3", "v4"}
            current_prog = len(completed_lesson_ids.intersection(vars_lessons))
        elif tmpl["type"] == "loops_region":
            loops_lessons = {"l1", "l2", "l3", "l4"}
            current_prog = len(completed_lesson_ids.intersection(loops_lessons))
        elif tmpl["type"] == "total_xp":
            current_prog = stats.total_xp if stats else 0
        elif tmpl["type"] == "streak":
            current_prog = stats.streak_days if stats else 0
        else:
            current_prog = 0

        current_prog = min(current_prog, tmpl["target"])
        is_completed = current_prog >= tmpl["target"]

        # Fetch or create db progress
        qp = db.query(QuestProgress).filter(
            QuestProgress.user_id == current_user.id,
            QuestProgress.quest_id == q_id
        ).first()

        if not qp:
            qp = QuestProgress(
                user_id=current_user.id,
                quest_id=q_id,
                progress=current_prog,
                completed=is_completed,
                claimed=False
            )
            db.add(qp)
        else:
            qp.progress = current_prog
            if is_completed and not qp.completed:
                qp.completed = True
                qp.completed_at = datetime.now(timezone.utc)

        db.commit()

        quests_out.append(QuestResponse(
            id=tmpl["id"],
            title=tmpl["title"],
            description=tmpl["description"],
            progress=qp.progress,
            target=tmpl["target"],
            xpReward=tmpl["xpReward"],
            difficulty=tmpl["difficulty"],
            completed=qp.completed,
            claimed=bool(qp.claimed)
        ))

    return quests_out

@router.post("/claim")
def claim_quest_reward(
    req: ClaimQuestRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    qp = db.query(QuestProgress).filter(
        QuestProgress.user_id == current_user.id,
        QuestProgress.quest_id == req.quest_id
    ).first()

    if not qp or not qp.completed:
        raise HTTPException(status_code=400, detail="Quest is not completed yet.")

    if qp.claimed:
        raise HTTPException(status_code=400, detail="Reward has already been claimed.")

    tmpl = next((t for t in QUEST_TEMPLATES if t["id"] == req.quest_id), None)
    xp_reward = tmpl["xpReward"] if tmpl else 50

    qp.claimed = True

    # Award XP
    stats = current_user.stats
    if stats:
        stats.total_xp += xp_reward
        stats.current_level = calculate_level(stats.total_xp)
        stats.rank = calculate_rank(stats.total_xp)

    db.commit()

    return {
        "status": "success",
        "claimed_quest_id": req.quest_id,
        "xp_reward": xp_reward,
        "total_xp": stats.total_xp if stats else 0
    }
