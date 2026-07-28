import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        return v

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserStats(BaseModel):
    current_level: int
    total_xp: int
    intelligence_stat: int
    streak_days: int
    
    # RPG Progression
    player_class: Optional[str] = None
    rank: str = "Novice"
    title: Optional[str] = None

    # Daily Login Rewards
    daily_streak: int = 0
    last_claimed_at: Optional[datetime] = None
    total_login_days: int = 0

    class Config:
        from_attributes = True

class InventoryItemResponse(BaseModel):
    id: int
    item_id: str
    acquired_at: datetime

    class Config:
        from_attributes = True

class ProgressionResponse(BaseModel):
    stats: UserStats
    inventory: list[InventoryItemResponse]

class ClassSelectionRequest(BaseModel):
    player_class: str

class XPRewardRequest(BaseModel):
    amount: int
    reason: str

class InventoryRewardRequest(BaseModel):
    item_id: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LeaderboardEntrySchema(BaseModel):
    rank: int
    user_id: int
    username: str
    level: int
    total_xp: int
    streak: int
    artifacts_collected: int
    regions_completed: int
    is_current_user: Optional[bool] = False

    class Config:
        from_attributes = True

class LeaderboardResponse(BaseModel):
    entries: list[LeaderboardEntrySchema]
    last_updated: datetime
