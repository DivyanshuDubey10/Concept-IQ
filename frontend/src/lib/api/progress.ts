import { api } from './api'

export interface ProgressConcept {
  name: string
  mastery: number
}

export interface ProgressTopic {
  topic_id: number
  topic_name: string
  mastery: number
  concepts: ProgressConcept[]
}

export interface UserProgress {
  overall_mastery: number
  topics: ProgressTopic[]
}

export interface ProgressHistoryItem {
  date: string
  concept_id: number
  mastery: number
}

export async function getProgress(): Promise<UserProgress> {
  const response = await api.get<UserProgress>('/api/progress')
  return response.data
}

export async function getProgressHistory(): Promise<ProgressHistoryItem[]> {
  const response = await api.get<ProgressHistoryItem[]>('/api/progress/history')
  return response.data
}
