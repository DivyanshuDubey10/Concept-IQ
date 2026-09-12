export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Prepare the API integration layer for:
// POST /api/auth/register
// POST /api/auth/login
// GET /api/auth/me

// These functions currently simulate network requests and will be replaced 
// by actual axios/fetch calls to the backend when integration begins.

export async function login(email: string, password: string):Promise<AuthResponse> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500))

  if (email === 'error@example.com') {
    throw new Error('Invalid email or password')
  }

  return {
    user: {
      id: '1',
      name: 'Student',
      email
    },
    token: 'mock-jwt-token'
  }
}

export async function register(name: string, email: string, password: string):Promise<AuthResponse> {
  await new Promise(resolve => setTimeout(resolve, 1500))

  if (email === 'taken@example.com') {
    throw new Error('Email is already registered')
  }

  return {
    user: {
      id: '1',
      name,
      email
    },
    token: 'mock-jwt-token'
  }
}

export async function getMe(token: string):Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  if (!token) {
    throw new Error('Unauthorized')
  }

  return {
    id: '1',
    name: 'Student',
    email: 'student@example.com'
  }
}
