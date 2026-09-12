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
  }
};
