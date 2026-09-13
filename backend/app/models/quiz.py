from datetime import datetime, timezone
from sqlalchemy import Integer, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base


class Quiz(Base):
    """
    Represents one adaptive learning session for a user on a topic.
    The `state` JSON column persists the in-memory data required by the
    intelligence layer between API requests:
      {
        "topic_name": str,
        "current_question": {
          "id": int,
          "concept_name": str,
          "difficulty": int,
          "text": str,
          "options": [{"id": int, "text": str}, ...],
          "correct_option_id": int
        },
        "performance": {
          "Base Cases": {"attempts": 1, "correct": 0, "history": [false]}
        },
        "question_counter": int
      }
    """
    __tablename__ = "quizzes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id"), nullable=False)
    state: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    sessions: Mapped[list["QuizSession"]] = relationship(
        "QuizSession", back_populates="quiz", cascade="all, delete-orphan"
    )


class QuizSession(Base):
    """Log of every individual answer submitted in a quiz."""
    __tablename__ = "quiz_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"), nullable=False, index=True)
    concept_id: Mapped[int] = mapped_column(ForeignKey("concepts.id"), nullable=False)
    question_text: Mapped[str] = mapped_column(nullable=False, default="")
    selected_option_id: Mapped[int] = mapped_column(Integer, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    answered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    quiz: Mapped["Quiz"] = relationship("Quiz", back_populates="sessions")
