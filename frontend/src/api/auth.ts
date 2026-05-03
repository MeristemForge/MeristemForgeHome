/**
 * Auth API module.
 * Currently uses mock data. Switch to real API by uncommenting the fetch-based
 * implementation and removing the mock import.
 */
import type { LoginRequest, LoginResponse } from '@/types'
import { mockLogin } from './mock'

// ─── Mock implementation (remove when backend is ready) ──────────────────────
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return mockLogin(credentials.username, credentials.password)
}

// ─── Real implementation (uncomment when backend is ready) ───────────────────
// import { api } from './client'
// export async function login(credentials: LoginRequest): Promise<LoginResponse> {
//   return api.post<LoginResponse>('/auth/login', credentials)
// }
