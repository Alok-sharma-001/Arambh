from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageCreate(BaseModel):
    conversation_id: int
    message: str
    code_context: Optional[str] = None

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    code_snapshot: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    concept_id: Optional[str] = None
    lesson_id: Optional[str] = None

class ConversationResponse(BaseModel):
    id: int
    concept_id: Optional[str] = None
    lesson_id: Optional[str] = None
    created_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True
