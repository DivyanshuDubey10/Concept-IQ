import { api } from './api'

export interface RevisionItem {
  concept_id: number
  name: string
  current_mastery: number
  // The API spec doesn't explicitly mention topic_name here, but visually we had 'Python' grouped.
  // We'll accommodate it if the backend adds it, else fallback to 'General' or similar.
  topic_name?: string 
}

export interface RevisionCompleteResponse {
  status: string
  next_revision_date: string
}

export async function getTodayRevision(): Promise<RevisionItem[]> {
  const response = await api.get<RevisionItem[]>('/api/revision/today')
  return response.data
}

export async function completeRevision(conceptId: number): Promise<RevisionCompleteResponse> {
  const response = await api.post<RevisionCompleteResponse>(`/api/revision/${conceptId}/complete`)
  return response.data
}
