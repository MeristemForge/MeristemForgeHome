import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    const auth = useAuthStore()
    if (auth.token) {
      headers['Authorization'] = `Bearer ${auth.token}`
    }
    return headers
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 401) {
      const auth = useAuthStore()
      auth.clearToken()
      router.push({ name: 'admin-login' })
      throw { error: 'unauthorized', message: 'Session expired' }
    }
    if (!res.ok) throw await res.json()
    return res.json()
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse<T>(res)
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })
    return this.handleResponse<T>(res)
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })
    return this.handleResponse<T>(res)
  }

  async delete(path: string): Promise<void> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    if (res.status === 401) {
      const auth = useAuthStore()
      auth.clearToken()
      router.push({ name: 'admin-login' })
      throw { error: 'unauthorized', message: 'Session expired' }
    }
    if (!res.ok) throw await res.json()
  }

  async upload<T>(path: string, formData: FormData): Promise<T> {
    const headers: HeadersInit = {}
    const auth = useAuthStore()
    if (auth.token) {
      headers['Authorization'] = `Bearer ${auth.token}`
    }
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    })
    return this.handleResponse<T>(res)
  }
}

export const api = new ApiClient()
