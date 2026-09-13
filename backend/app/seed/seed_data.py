"""
Seed script: populates the database with demo data required for the MVP demonstration.

Run from the project root:
    python -m backend.app.seed.seed_data
"""
from backend.app.database import SessionLocal
from backend.app.models.topic import Topic, Concept
from backend.app.models.question import Question

SEED_DATA = [
    {
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
        ],
    },
    {
        "topic": {
            "name": "Java",
            "description": "Learn object-oriented programming, memory management, and robust application design with Java.",
        },
        "concepts": [
            {
                "name": "OOP Basics",
                "questions": [
                    {
                        "difficulty": 1,
                        "content": "Which of the following is NOT a pillar of Object-Oriented Programming?",
                        "options": [
                            {"id": 1, "text": "Encapsulation"},
                            {"id": 2, "text": "Inheritance"},
                            {"id": 3, "text": "Compilation"},
                            {"id": 4, "text": "Polymorphism"},
                        ],
                        "correct_option_id": 3,
                    },
                    {
                        "difficulty": 2,
                        "content": "What is the purpose of the 'super' keyword in Java?",
                        "options": [
                            {"id": 1, "text": "To call a method of the parent class"},
                            {"id": 2, "text": "To create a global variable"},
                            {"id": 3, "text": "To speed up garbage collection"},
                            {"id": 4, "text": "To override a child class method"},
                        ],
                        "correct_option_id": 1,
                    },
                    {
                        "difficulty": 3,
                        "content": "Which statement about abstract classes and interfaces in Java 8+ is correct?",
                        "options": [
                            {"id": 1, "text": "A class can extend multiple abstract classes but implement only one interface"},
                            {"id": 2, "text": "Interfaces can have state (instance variables), while abstract classes cannot"},
                            {"id": 3, "text": "Both abstract classes and interfaces can have default implementations for methods"},
                            {"id": 4, "text": "Abstract classes cannot have constructors"},
                        ],
                        "correct_option_id": 3,
                    },
                ],
            },
            {
                "name": "Garbage Collection",
                "questions": [
                    {
                        "difficulty": 1,
                        "content": "What is the primary role of the Garbage Collector in Java?",
                        "options": [
                            {"id": 1, "text": "To delete unused source code files"},
                            {"id": 2, "text": "To reclaim memory occupied by objects that are no longer reachable"},
                            {"id": 3, "text": "To empty the recycle bin on the OS"},
                            {"id": 4, "text": "To format strings efficiently"},
                        ],
                        "correct_option_id": 2,
                    },
                    {
                        "difficulty": 2,
                        "content": "Can you force the Garbage Collector to run immediately in Java?",
                        "options": [
                            {"id": 1, "text": "Yes, by calling System.gc()"},
                            {"id": 2, "text": "No, you can only suggest it runs by calling System.gc(), but it is not guaranteed"},
                            {"id": 3, "text": "Yes, by setting an object to null"},
                            {"id": 4, "text": "No, it only runs when the JVM shuts down"},
                        ],
                        "correct_option_id": 2,
                    },
                    {
                        "difficulty": 3,
                        "content": "In the generational garbage collection model, where are new objects allocated?",
                        "options": [
                            {"id": 1, "text": "Tenured Space"},
                            {"id": 2, "text": "Survivor Space"},
                            {"id": 3, "text": "Eden Space (Young Generation)"},
                            {"id": 4, "text": "Metaspace"},
                        ],
                        "correct_option_id": 3,
                    },
                ],
            },
        ],
    },
    {
        "topic": {
            "name": "Machine Learning",
            "description": "Understand the algorithms and statistics that allow computers to learn from data.",
        },
        "concepts": [
            {
                "name": "Supervised Learning",
                "questions": [
                    {
                        "difficulty": 1,
                        "content": "What distinguishes supervised learning from unsupervised learning?",
                        "options": [
                            {"id": 1, "text": "Supervised learning requires labeled training data"},
                            {"id": 2, "text": "Supervised learning uses neural networks"},
                            {"id": 3, "text": "Supervised learning does not use algorithms"},
                            {"id": 4, "text": "Supervised learning is only used for image recognition"},
                        ],
                        "correct_option_id": 1,
                    },
                    {
                        "difficulty": 2,
                        "content": "Which of the following is a classic classification algorithm?",
                        "options": [
                            {"id": 1, "text": "K-Means Clustering"},
                            {"id": 2, "text": "Logistic Regression"},
                            {"id": 3, "text": "Principal Component Analysis (PCA)"},
                            {"id": 4, "text": "Apriori Algorithm"},
                        ],
                        "correct_option_id": 2,
                    },
                    {
                        "difficulty": 3,
                        "content": "In a Random Forest classifier, how is the final prediction determined for a given sample?",
                        "options": [
                            {"id": 1, "text": "By taking the prediction of the single deepest tree"},
                            {"id": 2, "text": "By applying gradient descent to tree outputs"},
                            {"id": 3, "text": "By taking a majority vote of all the individual decision trees"},
                            {"id": 4, "text": "By calculating the average of the leaf node impurities"},
                        ],
                        "correct_option_id": 3,
                    },
                ],
            },
            {
                "name": "Overfitting",
                "questions": [
                    {
                        "difficulty": 1,
                        "content": "What does 'overfitting' mean in machine learning?",
                        "options": [
                            {"id": 1, "text": "The model takes too long to train"},
                            {"id": 2, "text": "The model memorizes the training data but performs poorly on new, unseen data"},
                            {"id": 3, "text": "The model is too simple to capture the underlying pattern"},
                            {"id": 4, "text": "The dataset has too many columns"},
                        ],
                        "correct_option_id": 2,
                    },
                    {
                        "difficulty": 2,
                        "content": "Which technique is commonly used to prevent overfitting in neural networks?",
                        "options": [
                            {"id": 1, "text": "Increasing the learning rate"},
                            {"id": 2, "text": "Adding more layers to the network"},
                            {"id": 3, "text": "Dropout"},
                            {"id": 4, "text": "Removing activation functions"},
                        ],
                        "correct_option_id": 3,
                    },
                    {
                        "difficulty": 3,
                        "content": "How does L2 regularization (Ridge) help combat overfitting?",
                        "options": [
                            {"id": 1, "text": "It sets all weights to zero"},
                            {"id": 2, "text": "It drops random neurons during training"},
                            {"id": 3, "text": "It adds a penalty proportional to the sum of the squared weights to the loss function"},
                            {"id": 4, "text": "It removes outliers from the training dataset automatically"},
                        ],
                        "correct_option_id": 3,
                    },
                ],
            },
        ],
    },
    {
        "topic": {
            "name": "Data Structures & Algorithms",
            "description": "Learn the core data structures and algorithms needed to write efficient code and ace technical interviews.",
        },
        "concepts": [
            {
                "name": "Hash Tables",
                "questions": [
                    {
                        "difficulty": 1,
                        "content": "What is the primary advantage of using a Hash Table?",
                        "options": [
                            {"id": 1, "text": "It keeps elements sorted at all times"},
                            {"id": 2, "text": "It provides O(1) average time complexity for lookups and insertions"},
                            {"id": 3, "text": "It requires virtually no memory"},
                            {"id": 4, "text": "It is exactly the same as an array"},
                        ],
                        "correct_option_id": 2,
                    },
                    {
                        "difficulty": 2,
                        "content": "What happens when two distinct keys produce the same hash code?",
                        "options": [
                            {"id": 1, "text": "The program crashes"},
                            {"id": 2, "text": "The old key is permanently deleted"},
                            {"id": 3, "text": "A hash collision occurs, which must be handled (e.g. by chaining or open addressing)"},
                            {"id": 4, "text": "The table automatically doubles its size"},
                        ],
                        "correct_option_id": 3,
                    },
                    {
                        "difficulty": 3,
                        "content": "Why is the load factor important in a hash table?",
                        "options": [
                            {"id": 1, "text": "It determines how many hash functions are used"},
                            {"id": 2, "text": "It determines when the hash table needs to be resized to maintain O(1) performance"},
                            {"id": 3, "text": "It specifies the cryptographic strength of the hash"},
                            {"id": 4, "text": "It controls the order of iteration"},
                        ],
                        "correct_option_id": 2,
                    },
                ],
            },
        ],
    },
    {
        "topic": {
            "name": "SQL",
            "description": "Master relational databases, queries, joins, and data manipulation.",
        },
        "concepts": [
            {
                "name": "JOINs",
                "questions": [
                    {
                        "difficulty": 1,
                        "content": "Which SQL JOIN returns only the rows that have matching values in both tables?",
                        "options": [
                            {"id": 1, "text": "LEFT JOIN"},
                            {"id": 2, "text": "RIGHT JOIN"},
                            {"id": 3, "text": "FULL OUTER JOIN"},
                            {"id": 4, "text": "INNER JOIN"},
                        ],
                        "correct_option_id": 4,
                    },
                    {
                        "difficulty": 2,
                        "content": "If you want all rows from 'TableA' and only matching rows from 'TableB', which join do you use?",
                        "options": [
                            {"id": 1, "text": "INNER JOIN"},
                            {"id": 2, "text": "LEFT JOIN"},
                            {"id": 3, "text": "CROSS JOIN"},
                            {"id": 4, "text": "SELF JOIN"},
                        ],
                        "correct_option_id": 2,
                    },
                    {
                        "difficulty": 3,
                        "content": "What is the result of a CROSS JOIN between a table with 5 rows and a table with 10 rows?",
                        "options": [
                            {"id": 1, "text": "15 rows"},
                            {"id": 2, "text": "10 rows"},
                            {"id": 3, "text": "50 rows"},
                            {"id": 4, "text": "5 rows"},
                        ],
                        "correct_option_id": 3,
                    },
                ],
            },
        ],
    },
]


def seed():
    db = SessionLocal()
    try:
        print("🌱 Seeding database...")
        for data in SEED_DATA:
            topic_data = data["topic"]
            
            # Idempotent: skip if topic already exists
            existing = db.query(Topic).filter(Topic.name == topic_data["name"]).first()
            if existing:
                print(f"✅ Topic '{topic_data['name']}' already present. Skipping.")
                continue

            topic = Topic(name=topic_data["name"], description=topic_data["description"])
            db.add(topic)
            db.flush()  # get topic.id

            for concept_data in data["concepts"]:
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
            print(f"✅ Inserted topic: {topic_data['name']}")

        print("🎉 All seed data successfully populated.")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
