from datetime import datetime
from pydantic import BaseModel
from typing import List, Literal, Optional

class ChatMessageBase(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatMessageRead(ChatMessageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionRead(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    session_id: Optional[int] = None
    messages: List[ChatMessageBase]

class ChatResponse(BaseModel):
    reply: str
    session_id: int
