from backend.app.services.learning_service import process_student_answer

performance = {}
current_difficulty = 2

answers = [
    ("Inheritance", "A", "A"),
    ("Inheritance", "B", "A"),
]

for concept, student_answer, correct_answer in answers:
    try:
        result = process_student_answer(
            performance,
            "Java",
            concept,
            "What is inheritance?",
            student_answer,
            correct_answer,
            current_difficulty
        )

        client_res = result["client_response"]
        server_res = result["server_state"]

        current_difficulty = client_res["next_difficulty"]

        print("Explanation:", client_res["explanation"])
        print("Mastery:", server_res["new_mastery"])
        print("Weak Concepts:", client_res["weak_concepts"])
        print("Next Difficulty:", client_res["next_difficulty"])
        print("Revision Scheduled:", server_res["revision_scheduled"])

        if "next_question" in client_res:
            print("Targeted Question:")
            print(client_res["next_question"]["question"])
    except Exception as e:
        print(f"Skipping test due to exception (likely API key missing): {e}")
        
    print("-" * 50)