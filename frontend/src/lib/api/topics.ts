import { api } from './api'

export interface TopicConcept {
  concept_id: number
  name: string
  mastery?: number
}

export interface Topic {
  topic_id: number
  name: string
  description?: string
  concepts?: TopicConcept[]
  mastery?: number
  recommended_action?: string
}

export async function getTopics(): Promise<Topic[]> {
  const response = await api.get<Topic[]>('/api/topics')
  return response.data
}

export async function getTopicById(topicId: string): Promise<Topic> {
  const response = await api.get<Topic>(`/api/topics/${topicId}`)
  return response.data
}
