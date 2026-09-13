"""Initial schema: create all tables

Revision ID: 001
Revises:
Create Date: 2026-09-13
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # users
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"])

    # topics
    op.create_table(
        "topics",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index("ix_topics_id", "topics", ["id"])

    # concepts
    op.create_table(
        "concepts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("topic_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.ForeignKeyConstraint(["topic_id"], ["topics.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_concepts_id", "concepts", ["id"])
    op.create_index("ix_concepts_topic_id", "concepts", ["topic_id"])

    # questions
    op.create_table(
        "questions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("concept_id", sa.Integer(), nullable=False),
        sa.Column("difficulty", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("options", sa.JSON(), nullable=False),
        sa.Column("correct_option_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["concept_id"], ["concepts.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_questions_id", "questions", ["id"])
    op.create_index("ix_questions_concept_id", "questions", ["concept_id"])

    # quizzes
    op.create_table(
        "quizzes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("topic_id", sa.Integer(), nullable=False),
        sa.Column("state", sa.JSON(), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["topic_id"], ["topics.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_quizzes_id", "quizzes", ["id"])
    op.create_index("ix_quizzes_user_id", "quizzes", ["user_id"])

    # quiz_sessions
    op.create_table(
        "quiz_sessions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("quiz_id", sa.Integer(), nullable=False),
        sa.Column("concept_id", sa.Integer(), nullable=False),
        sa.Column("question_text", sa.Text(), nullable=False),
        sa.Column("selected_option_id", sa.Integer(), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False),
        sa.Column("answered_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["concept_id"], ["concepts.id"]),
        sa.ForeignKeyConstraint(["quiz_id"], ["quizzes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_quiz_sessions_id", "quiz_sessions", ["id"])
    op.create_index("ix_quiz_sessions_quiz_id", "quiz_sessions", ["quiz_id"])

    # user_concept_mastery
    op.create_table(
        "user_concept_mastery",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("concept_id", sa.Integer(), nullable=False),
        sa.Column("mastery_percentage", sa.Float(), nullable=False),
        sa.Column("next_revision_date", sa.Date(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["concept_id"], ["concepts.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("user_id", "concept_id"),
    )


def downgrade() -> None:
    op.drop_table("user_concept_mastery")
    op.drop_index("ix_quiz_sessions_quiz_id", table_name="quiz_sessions")
    op.drop_index("ix_quiz_sessions_id", table_name="quiz_sessions")
    op.drop_table("quiz_sessions")
    op.drop_index("ix_quizzes_user_id", table_name="quizzes")
    op.drop_index("ix_quizzes_id", table_name="quizzes")
    op.drop_table("quizzes")
    op.drop_index("ix_questions_concept_id", table_name="questions")
    op.drop_index("ix_questions_id", table_name="questions")
    op.drop_table("questions")
    op.drop_index("ix_concepts_topic_id", table_name="concepts")
    op.drop_index("ix_concepts_id", table_name="concepts")
    op.drop_table("concepts")
    op.drop_index("ix_topics_id", table_name="topics")
    op.drop_table("topics")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")
