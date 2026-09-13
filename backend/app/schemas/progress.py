from pydantic import BaseModel


class ProgressConceptOut(BaseModel):
    name: str
    mastery: float


class ProgressTopicOut(BaseModel):
    topic_id: int
    topic_name: str
    mastery: float
    concepts: list[ProgressConceptOut]


class ProgressResponse(BaseModel):
    overall_mastery: float
    topics: list[ProgressTopicOut]


class ProgressHistoryItem(BaseModel):
    date: str
    concept_id: int
    concept_name: str
    mastery: float
    is_correct: bool
