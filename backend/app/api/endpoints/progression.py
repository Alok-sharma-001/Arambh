from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.auth import get_current_user
from app.models.user import User, UserStats, InventoryItem
from app.schemas.user import (
    ProgressionResponse, 
    ClassSelectionRequest, 
    XPRewardRequest, 
    InventoryRewardRequest,
    InventoryItemResponse
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
