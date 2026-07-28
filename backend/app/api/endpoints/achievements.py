from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User, UserStats
from app.models.progression import AchievementProgress, RegionProgress, LessonProgress

router = APIRouter(prefix="/achievements", tags=["achievements"])

ACHIEVEMENT_TEMPLATES = [
    {
        "id": "a1",
        "title": "First Login",
        "description": "Welcome to Arambh! The journey begins.",
        "icon": "👋",
        "rarity": "Common",
        "type": "always_unlocked"
    },
    {
        "id": "a2",
        "title": "First Program",
        "description": "Write and run your first line of code.",
        "icon": "💻",
        "rarity": "Common",
        "type": "lesson_1"
    },
    {
        "id": "a3",
        "title": "Python Explorer",
        "description": "Complete the Variables Forest region.",
        "icon": "🌲",
        "rarity": "Rare",
        "type": "region_variables"
    },
    {
        "id": "a4",
        "title": "Master of Forms",
        "description": "Complete Data Types Valley and witness the true shapes of memory.",
        "icon": "🔮",
        "rarity": "Epic",
        "type": "region_data_types"
    },
    {
        "id": "a5",
        "title": "Master of Cycles",
        "description": "Survive the infinite serpent and complete Loops Desert.",
        "icon": "🔁",
        "rarity": "Epic",
        "type": "region_loops"
    },
    {
        "id": "a6",
        "title": "100 XP Club",
        "description": "Earn your first 100 Experience Points.",
        "icon": "💯",
        "rarity": "Rare",
        "type": "xp_100"
    },
    {
        "id": "a7",
        "title": "7 Day Streak",
        "description": "Maintain a learning streak for 7 consecutive days.",
        "icon": "🔥",
        "rarity": "Epic",
        "type": "streak_7"
    }
]

class AchievementResponse(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    rarity: str
    unlocked: bool
    unlockedAt: Optional[str] = None

@router.get("", response_model=List[AchievementResponse])
def get_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = current_user.stats
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        db.commit()

    completed_regions = db.query(RegionProgress).filter(
        RegionProgress.user_id == current_user.id,
        RegionProgress.status == "completed"
    ).all()
    completed_region_ids = {r.region_id for r in completed_regions}

    completed_lessons_count = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.status == "completed"
    ).count()

    achievements_out = []
    now = datetime.now(timezone.utc)

    for tmpl in ACHIEVEMENT_TEMPLATES:
        a_id = tmpl["id"]
        
        # Check condition
        if tmpl["type"] == "always_unlocked":
            is_unlocked = True
        elif tmpl["type"] == "lesson_1":
            is_unlocked = completed_lessons_count >= 1
        elif tmpl["type"] == "region_variables":
            is_unlocked = "variables-forest" in completed_region_ids
        elif tmpl["type"] == "region_data_types":
            is_unlocked = "data-types-valley" in completed_region_ids
        elif tmpl["type"] == "region_loops":
            is_unlocked = "loops-desert" in completed_region_ids
        elif tmpl["type"] == "xp_100":
            is_unlocked = stats.total_xp >= 100 if stats else False
        elif tmpl["type"] == "streak_7":
            is_unlocked = stats.streak_days >= 7 if stats else False
        else:
            is_unlocked = False

        ap = db.query(AchievementProgress).filter(
            AchievementProgress.user_id == current_user.id,
            AchievementProgress.achievement_id == a_id
        ).first()

        if not ap:
            ap = AchievementProgress(
                user_id=current_user.id,
                achievement_id=a_id,
                completed=is_unlocked,
                completed_at=now if is_unlocked else None
            )
            db.add(ap)
        else:
            if is_unlocked and not ap.completed:
                ap.completed = True
                ap.completed_at = now

        db.commit()

        unlocked_date_str = None
        if ap.completed_at:
            unlocked_date_str = ap.completed_at.strftime("%b %d, %Y")

        achievements_out.append(AchievementResponse(
            id=tmpl["id"],
            title=tmpl["title"],
            description=tmpl["description"],
            icon=tmpl["icon"],
            rarity=tmpl["rarity"],
            unlocked=ap.completed,
            unlockedAt=unlocked_date_str
        ))

    return achievements_out
