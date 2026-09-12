
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

    try:
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        
        question = json.loads(content)
        
        # Validate required keys
        required_keys = ["question", "options", "correct_answer", "explanation"]
        for key in required_keys:
            if key not in question:
                raise ValueError(f"Missing required key: {key}")
                
        if not all(k in question["options"] for k in ["A", "B", "C", "D"]):
            raise ValueError("Missing options A, B, C, or D")
            
        return question
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Warning: Question generation failed ({e}). Using fallback.")
        return {
            "question": f"Which of the following best describes {concept} in {topic}?",
            "options": {
                "A": f"It is the core principle of {concept}.",
                "B": "It is an unrelated concept.",
                "C": "It is a mathematical error.",
                "D": "None of the above."
            },
            "correct_answer": "A",
            "explanation": f"This is a fallback generated because the AI failed to produce valid JSON for {concept}."
        }

