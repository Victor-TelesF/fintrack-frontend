const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); this.name = 'ApiError' }
}

function parseDetail(data: unknown): string {
  if (!data || typeof data !== 'object' || !('detail' in data)) return 'Não foi possível concluir a solicitação.'
  const detail = (data as { detail: unknown }).detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map((item) => {
    if (item && typeof item === 'object' && 'msg' in item) return String(item.msg)
    return String(item)
  }).join(' • ')
  return 'Não foi possível concluir a solicitação.'
}

export async function api<T>(path: string, options: RequestInit = {}, authenticated = true): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('fintrack_token') : null
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (authenticated && token) headers.set('Authorization', `Bearer ${token}`)
  let response: Response
  try { response = await fetch(`${API_URL}${path}`, { ...options, headers }) }
  catch { throw new ApiError('Não foi possível conectar à API. Verifique se o servidor está disponível.', 0) }
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('fintrack_token'); localStorage.removeItem('fintrack_user'); window.dispatchEvent(new Event('fintrack:unauthorized'))
    throw new ApiError('Sua sessão expirou. Entre novamente.', 401)
  }
  if (!response.ok) {
    let data: unknown = null
    try { data = await response.json() } catch { /* resposta sem JSON */ }
    throw new ApiError(parseDetail(data), response.status)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const fetcher = <T>(path: string) => api<T>(path)
