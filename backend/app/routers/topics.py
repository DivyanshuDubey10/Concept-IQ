from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.topic import Topic, Concept
from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.schemas.topic import TopicOut, TopicDetailOut, ConceptOut

router = APIRouter(prefix="/api/topics", tags=["Topics"])


@router.get("", response_model=list[TopicOut])
def list_topics(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """List all available high-level topics."""
    topics = db.query(Topic).all()
    return [
        TopicOut(topic_id=t.id, name=t.name, description=t.description)
        for t in topics
    ]


@router.get("/{topic_id}", response_model=TopicDetailOut)
def get_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Get a topic's details including all its child concepts."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found.")
    concepts = db.query(Concept).filter(Concept.topic_id == topic_id).all()
    return TopicDetailOut(
        topic_id=topic.id,
        name=topic.name,
        description=topic.description,
        concepts=[ConceptOut(concept_id=c.id, name=c.name) for c in concepts],
    )
