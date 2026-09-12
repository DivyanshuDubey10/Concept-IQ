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
  ]
};
