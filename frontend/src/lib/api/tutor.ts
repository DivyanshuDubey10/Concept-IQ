import { api } from './api';

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface ChatSession {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  reply: string;
  session_id: number;
}

/**
 * Get all chat sessions for the current user.
 */
export async function getChatSessions(): Promise<ChatSession[]> {
  const response = await api.get<ChatSession[]>('/api/tutor/sessions');
  return response.data;
}

/**
 * Get all messages for a specific chat session.
 */
export async function getChatMessages(sessionId: number): Promise<ChatMessage[]> {
  const response = await api.get<ChatMessage[]>(`/api/tutor/sessions/${sessionId}/messages`);
  return response.data;
}

/**
 * Delete a specific chat session.
 */
export async function deleteChatSession(sessionId: number): Promise<void> {
  await api.delete(`/api/tutor/sessions/${sessionId}`);
}

/**
 * Send a message to the AI Tutor.
 * If sessionId is null, a new session is created on the backend.
 */
export async function sendChatMessage(messages: ChatMessage[], sessionId?: number | null): Promise<ChatResponse> {
  const payload = {
    session_id: sessionId || null,
    messages: messages.map(m => ({ role: m.role, content: m.content }))
  };
  const response = await api.post<ChatResponse>('/api/tutor/chat', payload);
  return response.data;
}
