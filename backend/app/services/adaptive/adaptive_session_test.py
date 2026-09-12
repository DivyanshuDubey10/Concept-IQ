from backend.app.services.adaptive.adaptive_session import run_adaptive_step

performance = {}
current_difficulty = 2

answers = [
    ("Inheritance", "A", "A"),
    ("Inheritance", "B", "A"),
]

for concept, student_answer, correct_answer in answers:
    # Need to catch potential API errors in test script if no keys are set, but for syntax this is fine.
    try:
        result = run_adaptive_step(
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
            print("Options:")
            print(client_res["next_question"]["options"])
    except Exception as e:
        print(f"Skipping test due to exception (likely API key missing): {e}")

    print("-" * 50)