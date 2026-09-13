from pydantic import BaseModel
from typing import Optional, Any


class QuizStartRequest(BaseModel):
    topic_id: int
    concept_id: Optional[int] = None


class QuizOption(BaseModel):
    id: int
    text: str


class QuizQuestion(BaseModel):
    question_id: int
    difficulty: int
    text: str
    options: list[QuizOption]


class QuizStartResponse(BaseModel):
    quiz_id: int
    first_question: QuizQuestion


class QuizStatusResponse(BaseModel):
    status: str
    current_question: Optional[QuizQuestion] = None


class SubmitAnswerRequest(BaseModel):
    question_id: int
    selected_option_id: int


class ConceptTested(BaseModel):
    concept_id: int
    name: str
    new_mastery_percentage: float


class SubmitAnswerResponse(BaseModel):
    is_completed: bool
    session_summary: Optional[Any] = None
    is_correct: bool
    correct_option_id: int
    concept_tested: ConceptTested
    ai_explanation: str
    next_question: Optional[QuizQuestion] = None
