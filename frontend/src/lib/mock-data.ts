export const dashboardData = {
  user: {
    firstName: "Maya",
  },
  overallProgress: {
    percentage: 68,
    changeThisWeek: 4.4,
  },
  currentFocus: {
    topic: "Python",
    subtopic: "Recursion",
    concept: "Base Cases",
    mastery: 32,
    message: "Let's strengthen this concept.",
  },
  needsAttention: [
    { id: 'c1', name: "Base Cases", mastery: 32 },
    { id: 'c2', name: "Method Overriding", mastery: 38 },
  ],
  todaysRevision: [
    { id: 'c1', name: "Base Cases", dueStatus: "Due today" }
  ],
  topics: [
    {
      id: 't1',
      name: "Python",
      description: "Master the fundamentals of Python programming, from syntax to advanced data structures.",
      mastery: 42,
      status: "continue"
    },
    {
      id: 't2',
      name: "Java",
      description: "Learn object-oriented programming principles and build robust backend applications.",
      mastery: 15,
      status: "continue"
    },
    {
      id: 't3',
      name: "Data Structures",
      description: "Understand the core structures that organize data efficiently for high-performance applications.",
      mastery: 0,
      status: "start"
    },
    {
      id: 't4',
      name: "Algorithms",
      description: "Develop problem-solving skills with sorting, searching, and complex graph algorithms.",
      mastery: 0,
      status: "start"
    },
    {
      id: 't5',
      name: "Databases",
      description: "Design robust schemas, write complex queries, and understand database normalization.",
      mastery: 0,
      status: "start"
    }
  ],
  topicDetail: {
    id: 't1',
    name: "Python",
    mastery: 82,
    message: "You're strong in most Python fundamentals. A few concepts need attention.",
    concepts: [
      { id: 'c1', name: "Recursion", mastery: 58 },
      { id: 'c2', name: "Functions", mastery: 86 },
      { id: 'c3', name: "OOP", mastery: 81 },
      { id: 'c4', name: "Data Structures", mastery: 74 }
    ],
    recommendedNext: {
      action: "Strengthen Recursion"
    }
  },
  quizData: {
    topicName: "Python",
    conceptName: "Recursion",
    questions: [
      {
        id: "q1",
        text: "What is the primary purpose of a base case in a recursive function?",
        options: [
          { id: "o1", text: "To start the recursive calls" },
          { id: "o2", text: "To prevent infinite recursion by stopping the calls" },
          { id: "o3", text: "To optimize the memory usage of the function" },
          { id: "o4", text: "To return the final accumulated value to the user" }
        ],
        correctOptionId: "o2",
        explanation: "A base case provides a condition under which the recursion stops, preventing an infinite loop that would eventually cause a stack overflow."
      },
      {
        id: "q2",
        text: "Which of the following problems is best suited for a recursive solution?",
        options: [
          { id: "o1", text: "Calculating the sum of an array using a for loop" },
          { id: "o2", text: "Traversing a tree or graph data structure" },
          { id: "o3", text: "Connecting to a database" },
          { id: "o4", text: "Parsing a JSON string into an object" }
        ],
        correctOptionId: "o2",
        explanation: "Trees and graphs are naturally recursive data structures, making recursive traversal algorithms (like DFS) highly elegant and suitable."
      }
    ]
  },
  conceptAnalysis: {
    heading: "Here's what we found.",
    message: "You understand most of Recursion, but Base Cases needs attention.",
    primaryConcept: {
      name: "Base Cases",
      mastery: 32,
      status: "Needs practice"
    },
    supportingConcepts: [
      { name: "Recursive Calls", mastery: 78 },
      { name: "Call Stack", mastery: 65 }
    ],
    nextSteps: {
      message: "Let's strengthen your understanding of Base Cases."
    }
  },
  adaptivePracticeData: {
    topicName: "Recursion",
    conceptName: "Base Cases",
    initialMastery: 32,
    questions: [
      {
        id: "p1",
        difficulty: "Easy",
        text: "What happens if a recursive function does not have a base case?",
        options: [
          { id: "o1", text: "The function will run exactly once" },
          { id: "o2", text: "The function will cause a compilation error" },
          { id: "o3", text: "The function will recurse infinitely until stack overflow" },
          { id: "o4", text: "The function will automatically return null" }
        ],
        correctOptionId: "o3",
        explanation: "Without a base case, there is no stopping condition, leading to infinite recursion."
      },
      {
        id: "p2",
        difficulty: "Medium",
        text: "In a recursive function calculating factorial(n), what is the standard base case?",
        options: [
          { id: "o1", text: "if (n == 0) return 0" },
          { id: "o2", text: "if (n <= 1) return 1" },
          { id: "o3", text: "if (n == -1) return 1" },
          { id: "o4", text: "if (n == 1) return n * 1" }
        ],
        correctOptionId: "o2",
        explanation: "The factorial of 0 and 1 is 1, providing a solid base case to stop."
      },
      {
        id: "p3",
        difficulty: "Hard",
        text: "Which of the following is true regarding tail recursion base cases?",
        options: [
          { id: "o1", text: "Tail recursion does not require a base case" },
          { id: "o2", text: "The base case must return a function pointer" },
          { id: "o3", text: "The base case typically returns the accumulated parameter" },
          { id: "o4", text: "Tail recursion requires two distinct base cases" }
        ],
        correctOptionId: "o3",
        explanation: "In tail recursion, the accumulator holds the final result, which is returned by the base case."
      }
    ]
  }
};
