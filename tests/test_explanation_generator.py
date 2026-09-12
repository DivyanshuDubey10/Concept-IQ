from unittest.mock import patch, MagicMock
from backend.app.services.ai.explanation_generator import generate_explanation

@patch('backend.app.services.ai.explanation_generator.client.chat.completions.create')
def test_explanation_generator_correct_answer(mock_create):
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = "Great job! B is correct because 2x=4 means x=2."
    mock_create.return_value = mock_response

    explanation = generate_explanation(
        topic="Math",
        concept="Algebra",
        question="What is 2x = 4?",
        student_answer="B",
        correct_answer="B",
        mastery=90
    )

    assert "Great job" in explanation
    mock_create.assert_called_once()

@patch('backend.app.services.ai.explanation_generator.client.chat.completions.create')
def test_explanation_generator_incorrect_answer(mock_create):
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = "Not quite. A is incorrect because 2*1=2, not 4. The correct answer is B because 4/2=2."
    mock_create.return_value = mock_response

    explanation = generate_explanation(
        topic="Math",
        concept="Algebra",
        question="What is 2x = 4?",
        student_answer="A",
        correct_answer="B",
        mastery=20
    )

    assert "Not quite" in explanation
    # Ensure the prompt contains details reflecting low mastery
    call_args = mock_create.call_args[1]
    messages = call_args['messages']
    prompt_content = messages[1]['content']
    assert "Student mastery: 20%" in prompt_content
    assert "student's answer was incorrect" in prompt_content
