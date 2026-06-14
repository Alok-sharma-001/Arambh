from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GuildCreate(BaseModel):
    name: str
    description: Optional[str] = None
    crest_id: Optional[str] = "shield"

class GuildMemberSchema(BaseModel):
    user_id: int
    username: str
    role: str
    joined_at: datetime
    contribution_gxp: int
    level: int
    rank: str

class GuildProgressSchema(BaseModel):
    active_boss_id: Optional[str]
    boss_health_remaining: int
    completed_bosses: List[str]
    active_quests: List[str]

class GuildResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    crest_id: str
    level: int
    total_gxp: int
    reputation: int
    created_at: datetime
    members: List[GuildMemberSchema]
    progress: Optional[GuildProgressSchema]

class GuildSummary(BaseModel):
    id: int
    name: str
    crest_id: str
    level: int
    member_count: int
    reputation: int

class GuildActionResponse(BaseModel):
    status: str
    detail: str
