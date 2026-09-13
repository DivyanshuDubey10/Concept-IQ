import { api } from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
}

/**
 * Send the conversation history to the AI Tutor and get a response.
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  const response = await api.post<ChatResponse>('/api/tutor/chat', { messages });
  return response.data;
}
