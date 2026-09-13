import { api } from './api'

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

// Prepare the API integration layer for:
// POST /api/auth/register
// POST /api/auth/login
// GET /api/auth/me

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/login', { email, password })
  return response.data
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/register', { name, email, password })
  return response.data
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/api/auth/me')
  return response.data
}

export async function changePassword(current_password: string, new_password: string): Promise<{message: string}> {
  const response = await api.post<{message: string}>('/api/auth/change-password', { current_password, new_password })
  return response.data
}
