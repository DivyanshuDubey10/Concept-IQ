from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")

    concepts: Mapped[list["Concept"]] = relationship(
        "Concept", back_populates="topic", cascade="all, delete-orphan"
    )


class Concept(Base):
    __tablename__ = "concepts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    topic: Mapped["Topic"] = relationship("Topic", back_populates="concepts")
    questions: Mapped[list["Question"]] = relationship(
        "Question", back_populates="concept", cascade="all, delete-orphan"
    )
