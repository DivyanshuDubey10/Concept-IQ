import { api } from './api'

export interface QuizOption {
  id: number
  text: string
}

export interface QuizQuestion {
  question_id: number
  difficulty?: number
  text: string
  options: QuizOption[]
}

export interface QuizStartResponse {
  quiz_id: string
  first_question: QuizQuestion
}

export interface QuizStatusResponse {
  status: string
  current_question: QuizQuestion
}

export interface ConceptTested {
  concept_id: number
  name: string
  new_mastery_percentage: number
}

export interface QuizSubmitResponse {
  is_completed: boolean
  session_summary?: any
  is_correct: boolean
  correct_option_id: number
  concept_tested: ConceptTested
  ai_explanation: string
  next_question?: QuizQuestion
}

export async function startQuiz(topicId: number, conceptId?: number): Promise<QuizStartResponse> {
  const payload: any = { topic_id: topicId }
  if (conceptId !== undefined) {
    payload.concept_id = conceptId
  }
  const response = await api.post<QuizStartResponse>('/api/quizzes/start', payload)
  return response.data
}

export async function getQuizStatus(quizId: string): Promise<QuizStatusResponse> {
  const response = await api.get<QuizStatusResponse>(`/api/quizzes/${quizId}`)
  return response.data
}

export async function submitQuizAnswer(quizId: string, questionId: number, selectedOptionId: number): Promise<QuizSubmitResponse> {
  const response = await api.post<QuizSubmitResponse>(`/api/quizzes/${quizId}/submit`, {
    question_id: questionId,
    selected_option_id: selectedOptionId
  })
  return response.data
}
