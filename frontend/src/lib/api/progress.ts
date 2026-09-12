import { api } from './api'

export interface ProgressConcept {
  name: string
  mastery: number
}

export interface ProgressTopic {
  topic_name: string
  concepts: ProgressConcept[]
}

export interface ProgressResponse {
  topics: ProgressTopic[]
}

export interface ProgressHistoryItem {
  date: string
  concept_id: number
  mastery: number
}

export async function getProgress(): Promise<ProgressResponse> {
  const response = await api.get<ProgressResponse>('/api/progress')
  return response.data
}

export async function getProgressHistory(): Promise<ProgressHistoryItem[]> {
  const response = await api.get<ProgressHistoryItem[]>('/api/progress/history')
  return response.data
}
