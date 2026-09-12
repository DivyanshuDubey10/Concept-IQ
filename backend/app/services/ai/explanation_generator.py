from openai import OpenAI
from dotenv import load_dotenv
import os


load_dotenv()

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY")
)


def generate_explanation(
    topic,
    concept,
    question,
    student_answer,
    correct_answer,
    mastery
):

    prompt = f"""
You are a personalized AI tutor.

Topic: {topic}
Concept: {concept}
Question: {question}

Student's answer: {student_answer}
Correct answer: {correct_answer}
Student mastery: {mastery}%

The student needs help understanding this concept.

Explain:
1. Why the correct answer is correct.
2. Why the student's answer was incorrect, if it was incorrect.
3. The concept in simple language.
4. One small example.

Keep the explanation appropriate for a student who has
{mastery}% mastery of this concept.
"""

    response = client.chat.completions.create(
        model="nvidia/nemotron-3.5-lightning-30b-a3b",
        messages=[
            {
                "role": "system",
                "content": "You are a patient educational AI tutor. Do not show your reasoning. Give only the final explanation."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=500,
        extra_body={
            "chat_template_kwargs": {
                "enable_thinking": False
            }
        }
    )

    return response.choices[0].message.content