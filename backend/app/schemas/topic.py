from pydantic import BaseModel


class ConceptOut(BaseModel):
    concept_id: int
    name: str

    model_config = {"from_attributes": True}


class TopicOut(BaseModel):
    topic_id: int
    name: str
    description: str

    model_config = {"from_attributes": True}


class TopicDetailOut(BaseModel):
    topic_id: int
    name: str
    description: str
    concepts: list[ConceptOut]

    model_config = {"from_attributes": True}
