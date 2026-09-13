"""
Seed script: populates the database with the Python topic demo data
required for the hackathon demonstration.

Run from the project root:
    python -m backend.app.seed.seed_data

Topics:    Python
Concepts:  Base Cases, Recursive Calls, Stack Frames
Questions: 3 per concept × 3 difficulties = 9 questions
"""
from backend.app.database import SessionLocal
from backend.app.models.topic import Topic, Concept
from backend.app.models.question import Question


SEED_DATA = {
    "topic": {
        "name": "Python",
        "description": "Master the fundamentals of Python programming, from syntax to advanced data structures.",
    },
    "concepts": [
        {
            "name": "Base Cases",
            "questions": [
                {
                    "difficulty": 1,
                    "content": "What happens if a recursive function does not have a base case?",
                    "options": [
                        {"id": 1, "text": "The function will run exactly once"},
                        {"id": 2, "text": "The function will cause a compilation error"},
                        {"id": 3, "text": "The function will recurse infinitely, causing a stack overflow"},
                        {"id": 4, "text": "The function will automatically return None"},
                    ],
                    "correct_option_id": 3,
                },
                {
                    "difficulty": 2,
                    "content": "In a recursive factorial function `factorial(n)`, what is the correct base case?",
                    "options": [
                        {"id": 1, "text": "if n == 0: return 0"},
                        {"id": 2, "text": "if n <= 1: return 1"},
                        {"id": 3, "text": "if n == -1: return 1"},
                        {"id": 4, "text": "if n == 1: return n * 1"},
                    ],
                    "correct_option_id": 2,
                },
                {
                    "difficulty": 3,
                    "content": "Which of the following is true about tail recursion and its base case?",
                    "options": [
                        {"id": 1, "text": "Tail recursion does not require a base case"},
                        {"id": 2, "text": "The base case must return a function pointer"},
                        {"id": 3, "text": "The base case typically returns the accumulated parameter value"},
                        {"id": 4, "text": "Tail recursion requires two distinct base cases"},
                    ],
                    "correct_option_id": 3,
                },
            ],
        },
        {
            "name": "Recursive Calls",
            "questions": [
                {
                    "difficulty": 1,
                    "content": "What is a recursive call?",
                    "options": [
                        {"id": 1, "text": "A function calling another function"},
                        {"id": 2, "text": "A function calling itself"},
                        {"id": 3, "text": "A loop that repeats 10 times"},
                        {"id": 4, "text": "A function with multiple return statements"},
                    ],
                    "correct_option_id": 2,
                },
                {
                    "difficulty": 2,
                    "content": "Which of the following best describes how recursive calls work in `sum_list([1, 2, 3])`?",
                    "options": [
                        {"id": 1, "text": "Python iterates over the list using a for loop internally"},
                        {"id": 2, "text": "The function calls sum_list([2, 3]) then adds 1 to the result"},
                        {"id": 3, "text": "Python duplicates the list and adds all elements at once"},
                        {"id": 4, "text": "The function converts the list to a tuple before summing"},
                    ],
                    "correct_option_id": 2,
                },
                {
                    "difficulty": 3,
                    "content": "In Python, what is the default maximum recursion depth and how do you change it?",
                    "options": [
                        {"id": 1, "text": "1000; use sys.setrecursionlimit(n)"},
                        {"id": 2, "text": "500; use os.setrecursionlimit(n)"},
                        {"id": 3, "text": "Unlimited; Python has no recursion limit"},
                        {"id": 4, "text": "100; use threading.stack_size(n)"},
                    ],
                    "correct_option_id": 1,
                },
            ],
        },
        {
            "name": "Stack Frames",
            "questions": [
                {
                    "difficulty": 1,
                    "content": "What is a call stack frame?",
                    "options": [
                        {"id": 1, "text": "A block of memory that stores a function's local variables and return address"},
                        {"id": 2, "text": "A type of Python data structure similar to a list"},
                        {"id": 3, "text": "A method used to sort items in a stack"},
                        {"id": 4, "text": "A Python decorator for memory optimization"},
                    ],
                    "correct_option_id": 1,
                },
                {
                    "difficulty": 2,
                    "content": "When a recursive function calls itself, what happens to the call stack?",
                    "options": [
                        {"id": 1, "text": "A new frame is popped off the stack for each call"},
                        {"id": 2, "text": "A new frame is pushed onto the stack for each call"},
                        {"id": 3, "text": "The stack is cleared and reused"},
                        {"id": 4, "text": "The stack remains unchanged; only heap memory is used"},
                    ],
                    "correct_option_id": 2,
                },
                {
                    "difficulty": 3,
                    "content": "Why does tail call optimization (TCO) reduce stack frame usage?",
                    "options": [
                        {"id": 1, "text": "TCO converts recursive calls into loops, reusing the same stack frame"},
                        {"id": 2, "text": "TCO copies all variables to the heap before the call"},
                        {"id": 3, "text": "TCO prevents functions from calling themselves more than once"},
                        {"id": 4, "text": "TCO removes the base case from recursive functions"},
                    ],
                    "correct_option_id": 1,
                },
            ],
        },
    ],
}


def seed():
    db = SessionLocal()
    try:
        # Idempotent: skip if Python topic already exists
        existing = db.query(Topic).filter(Topic.name == "Python").first()
        if existing:
            print("✅ Seed data already present. Skipping.")
            return

        print("🌱 Seeding database...")

        topic_data = SEED_DATA["topic"]
        topic = Topic(name=topic_data["name"], description=topic_data["description"])
        db.add(topic)
        db.flush()  # get topic.id

        for concept_data in SEED_DATA["concepts"]:
            concept = Concept(name=concept_data["name"], topic_id=topic.id)
            db.add(concept)
            db.flush()  # get concept.id

            for q_data in concept_data["questions"]:
                question = Question(
                    concept_id=concept.id,
                    difficulty=q_data["difficulty"],
                    content=q_data["content"],
                    options=q_data["options"],
                    correct_option_id=q_data["correct_option_id"],
                )
                db.add(question)

        db.commit()
        print("✅ Seed complete: Python topic with 3 concepts and 9 questions inserted.")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
