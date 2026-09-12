from openai import OpenAI
from dotenv import load_dotenv
import os
import json


load_dotenv()

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY")
)


def generate_question(topic, concept, difficulty):

    prompt = f"""
Generate one multiple-choice question.

Topic: {topic}
Concept: {concept}
Difficulty: {difficulty}

Return ONLY valid JSON in exactly this format:

{{
    "question": "question text",
    "options": {{
        "A": "option A",
        "B": "option B",
        "C": "option C",
        "D": "option D"
    }},
    "correct_answer": "A",
    "explanation": "short explanation"
}}
"""

    response = client.chat.completions.create(
        model="nvidia/nemotron-3.5-lightning-30b-a3b",
        messages=[
            {
                "role": "system",
                "content": "You are an educational AI tutor. Give only the final answer. Do not show your reasoning."
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

    content = response.choices[0].message.content

    question = json.loads(content)

    return question

