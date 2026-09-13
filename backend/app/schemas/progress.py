from pydantic import BaseModel


class ProgressConceptOut(BaseModel):
    name: str
    mastery: float


class ProgressTopicOut(BaseModel):
    topic_name: str
    concepts: list[ProgressConceptOut]


class ProgressResponse(BaseModel):
    topics: list[ProgressTopicOut]


class ProgressHistoryItem(BaseModel):
    date: str
    concept_id: int
    concept_name: str
    mastery: float
    is_correct: bool
