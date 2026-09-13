from sqlalchemy import Integer, Text, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base


class Question(Base):
    """
    Seed questions used as a fallback when the AI question generator is unavailable.
    Questions are mapped to concepts, not topics, to enable granular adaptive practice.
    Difficulty: 1=Easy, 2=Medium, 3=Hard.
    """
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    concept_id: Mapped[int] = mapped_column(ForeignKey("concepts.id"), nullable=False, index=True)
    difficulty: Mapped[int] = mapped_column(Integer, nullable=False)  # 1=Easy, 2=Medium, 3=Hard
    content: Mapped[str] = mapped_column(Text, nullable=False)
    # options stored as list: [{"id": 1, "text": "..."}, ...]
    options: Mapped[list] = mapped_column(JSON, nullable=False)
    correct_option_id: Mapped[int] = mapped_column(Integer, nullable=False)

    concept: Mapped["Concept"] = relationship("Concept", back_populates="questions")
