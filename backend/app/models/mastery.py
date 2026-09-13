from datetime import datetime, timezone, date
from sqlalchemy import Date, DateTime, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from backend.app.database import Base


class UserConceptMastery(Base):
    """
    Tracks a user's mastery percentage for each concept.
    This is the core table powering the adaptive engine and revision scheduling.
    Composite primary key: (user_id, concept_id).
    """
    __tablename__ = "user_concept_mastery"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    concept_id: Mapped[int] = mapped_column(ForeignKey("concepts.id"), primary_key=True)
    mastery_percentage: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    next_revision_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
