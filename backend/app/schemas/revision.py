from pydantic import BaseModel
from typing import Optional


class RevisionItemOut(BaseModel):
    concept_id: int
    name: str
    current_mastery: float
    topic_name: Optional[str] = None


class RevisionCompleteResponse(BaseModel):
    status: str
    next_revision_date: str
