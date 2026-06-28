from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User, UserStats, InventoryItem
from app.schemas.user import (
    ProgressionResponse, 
    ClassSelectionRequest, 
    XPRewardRequest, 
    InventoryRewardRequest,
    InventoryItemResponse,
    LeaderboardResponse
)

router = APIRouter()

# ── Level thresholds: cumulative XP needed to reach each level ──
LEVEL_THRESHOLDS = {
    1: 0, 2: 250, 3: 600, 4: 1000, 5: 1600,
    6: 2500, 7: 3500, 8: 5000, 9: 7000, 10: 10000,
}

# ── Rank thresholds: based on total XP ──
RANK_THRESHOLDS = [
    (0,    "Novice"),
    (501,  "Explorer"),
    (1501, "Adept"),
    (3001, "Master"),
    (5001, "Grandmaster"),
]

def calculate_level(total_xp: int) -> int:
    level = 1
    max_level = max(LEVEL_THRESHOLDS.keys())
    for lv in range(2, max_level + 1):
        if total_xp >= LEVEL_THRESHOLDS[lv]:
            level = lv
        else:
            break
    # Beyond defined thresholds, extrapolate
    if total_xp >= LEVEL_THRESHOLDS[max_level]:
        excess = total_xp - LEVEL_THRESHOLDS[max_level]
        level = max_level + excess // 3000
    return level

def calculate_rank(total_xp: int) -> str:
    rank = "Novice"
    for min_xp, rank_name in RANK_THRESHOLDS:
        if total_xp >= min_xp:
            rank = rank_name
    return rank

@router.get("/me", response_model=ProgressionResponse)
def get_progression(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = current_user.stats
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        db.commit()
        db.refresh(stats)
        
    return ProgressionResponse(
        stats=stats,
        inventory=current_user.inventory
    )

@router.post("/class", response_model=ProgressionResponse)
def set_player_class(
    request: ClassSelectionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = current_user.stats
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
    
    if stats.player_class:
        raise HTTPException(status_code=400, detail="Class is already set.")
        
    stats.player_class = request.player_class
    db.commit()
    db.refresh(stats)
    
    return ProgressionResponse(
        stats=stats,
        inventory=current_user.inventory
    )

@router.post("/xp", response_model=ProgressionResponse)
def add_xp(
    request: XPRewardRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = current_user.stats
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        
    stats.total_xp += request.amount
    
    # Use centralized level/rank calculators
    new_level = calculate_level(stats.total_xp)
    
    if new_level > stats.current_level:
        stats.current_level = new_level
    stats.rank = calculate_rank(stats.total_xp)
    
    # Log gain_xp event
    from app.models.analytics import AnalyticsEvent
    import json
    xp_event = AnalyticsEvent(
        user_id=current_user.id,
        event_type="gain_xp",
        details=json.dumps({"amount": request.amount})
    )
    db.add(xp_event)
        
    db.commit()
    db.refresh(stats)
    
    return ProgressionResponse(
        stats=stats,
        inventory=current_user.inventory
    )

@router.post("/inventory", response_model=ProgressionResponse)
def add_inventory_item(
    request: InventoryRewardRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure stats exist
    stats = current_user.stats
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        db.commit()
        db.refresh(stats)

    # Check if user already has it
    existing = db.query(InventoryItem).filter(
        InventoryItem.user_id == current_user.id,
        InventoryItem.item_id == request.item_id
    ).first()
    
    if not existing:
        new_item = InventoryItem(user_id=current_user.id, item_id=request.item_id)
        db.add(new_item)
        db.commit()
        
    # Refresh user to get updated inventory
    db.refresh(current_user)
    
    return ProgressionResponse(
        stats=current_user.stats,
        inventory=current_user.inventory
    )

@router.get("/leaderboard", response_model=LeaderboardResponse)
def get_leaderboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from datetime import datetime
    from app.schemas.user import LeaderboardEntrySchema
    
    # Query top 50 users based on total_xp
    top_stats = db.query(UserStats).order_by(UserStats.total_xp.desc()).limit(50).all()
    
    entries = []
    rank = 1
    for stat in top_stats:
        user = stat.user
        
        # Calculate derived stats if needed
        # We can optimize this later with a join/group_by, but for now this works.
        artifacts_count = len(user.inventory) if user.inventory else 0
        regions_count = len([r for r in user.regions if r.status == 'completed']) if user.regions else 0
        
        entries.append(LeaderboardEntrySchema(
            rank=rank,
            user_id=user.id,
            username=user.username,
            level=stat.current_level,
            total_xp=stat.total_xp,
            streak=stat.streak_days,
            artifacts_collected=artifacts_count,
            regions_completed=regions_count,
            is_current_user=(user.id == current_user.id)
        ))
        rank += 1
        
    return LeaderboardResponse(
        entries=entries,
        last_updated=datetime.now()
    )

@router.post("/claim-daily", response_model=ProgressionResponse)
def claim_daily_reward(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from datetime import datetime, timezone
    import json
    from app.models.analytics import AnalyticsEvent
    
    stats = current_user.stats
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        db.commit()
        db.refresh(stats)

    now = datetime.now(timezone.utc)
    
    # Check if user can claim (>21 hours since last claim)
    if stats.last_claimed_at:
        # Normalize timezone to compare
        last_claimed = stats.last_claimed_at
        if last_claimed.tzinfo is None:
            last_claimed = last_claimed.replace(tzinfo=timezone.utc)
            
        hours_since = (now - last_claimed).total_seconds() / 3600
        if hours_since < 21:
            raise HTTPException(
                status_code=400,
                detail=f"Too early to claim. Wait {round(21 - hours_since, 1)} more hours."
            )
    
    # Check if streak is broken (>48h since last claim)
    if stats.last_claimed_at:
        last_claimed = stats.last_claimed_at
        if last_claimed.tzinfo is None:
            last_claimed = last_claimed.replace(tzinfo=timezone.utc)
            
        if (now - last_claimed).total_seconds() > 48 * 3600:
            stats.daily_streak = 0  # Reset streak
    
    # Increment streak and total login days
    stats.daily_streak += 1
    stats.total_login_days = (stats.total_login_days or 0) + 1
    stats.last_claimed_at = now
    
    # Calculate XP reward based on streak day (capped at 7-day cycle)
    cycle_day = ((stats.daily_streak - 1) % 7) + 1
    DAILY_XP = {1: 25, 2: 50, 3: 75, 4: 100, 5: 125, 6: 150, 7: 250}
    xp_reward = DAILY_XP.get(cycle_day, 25)
    
    # Award XP
    stats.total_xp += xp_reward
    new_level = calculate_level(stats.total_xp)
    if new_level > stats.current_level:
        stats.current_level = new_level
    stats.rank = calculate_rank(stats.total_xp)
    
    # Log analytics event
    event = AnalyticsEvent(
        user_id=current_user.id,
        event_type="daily_reward_claimed",
        details=json.dumps({
            "day": cycle_day,
            "xp_awarded": xp_reward,
            "streak": stats.daily_streak,
            "total_login_days": stats.total_login_days
        })
    )
    db.add(event)
    
    db.commit()
    db.refresh(stats)
    
    return ProgressionResponse(
        stats=stats,
        inventory=current_user.inventory
    )
