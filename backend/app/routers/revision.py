from datetime import date, timedelta, datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.topic import Concept, Topic
from backend.app.models.mastery import UserConceptMastery
from backend.app.core.security import get_current_user
from backend.app.schemas.revision import RevisionItemOut, RevisionCompleteResponse

router = APIRouter(prefix="/api/revision", tags=["Revision"])

# Ordered spaced revision intervals (in days)
REVISION_INTERVALS = [0, 1, 3, 7]


def _next_interval_days(current_days_until: int) -> int:
    """
    Given the current interval (days until next revision), return the next one.
    Follows the progression: Today(0) → +1 → +3 → +7 → +7 (capped).
    """
    if current_days_until < 1:
        return 1
    elif current_days_until < 3:
        return 3
    elif current_days_until < 7:
        return 7
    else:
        return 7  # Capped at maximum interval


@router.get("/today", response_model=list[RevisionItemOut])
def get_today_revision(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return all concepts due for revision today (next_revision_date <= today),
    sorted by mastery percentage ascending so weakest concepts appear first.
    """
    today = date.today()
    due_rows = (
        db.query(UserConceptMastery)
        .filter(
            UserConceptMastery.user_id == current_user.id,
            UserConceptMastery.next_revision_date <= today,
        )
        .order_by(UserConceptMastery.mastery_percentage.asc())
        .all()
    )

    result = []
    for row in due_rows:
        concept = db.query(Concept).filter(Concept.id == row.concept_id).first()
        if not concept:
            continue
        topic = db.query(Topic).filter(Topic.id == concept.topic_id).first()
        result.append(
            RevisionItemOut(
                concept_id=concept.id,
                name=concept.name,
                current_mastery=round(row.mastery_percentage, 1),
                topic_name=topic.name if topic else None,
            )
        )
    return result


@router.post("/{concept_id}/complete", response_model=RevisionCompleteResponse)
def complete_revision(
    concept_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mark a revision as explicitly complete for a concept.
    Bumps the next_revision_date to the next spaced interval.
    """
    mastery_row = (
        db.query(UserConceptMastery)
        .filter(
            UserConceptMastery.user_id == current_user.id,
            UserConceptMastery.concept_id == concept_id,
        )
        .first()
    )
    if not mastery_row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No mastery record found for this concept. Start a quiz first.",
        )

    today = date.today()
    current_revision = mastery_row.next_revision_date or today
    days_from_today = (current_revision - today).days if current_revision >= today else 0
    next_days = _next_interval_days(days_from_today)
    next_date = today + timedelta(days=next_days)

    mastery_row.next_revision_date = next_date
    mastery_row.updated_at = datetime.now(timezone.utc)
    db.commit()

    return RevisionCompleteResponse(
        status="success",
        next_revision_date=next_date.isoformat(),
    )
