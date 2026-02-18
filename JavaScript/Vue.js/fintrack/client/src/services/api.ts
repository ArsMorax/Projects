import axios from 'axios'
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  Transaction,
  Category,
  DashboardStats,
  TransactionFilters,
  CreateTransaction,
} from '@/types'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fintrack_token')
      localStorage.removeItem('fintrack_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register(data: { name: string; email: string; password: string }) {
    return api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data)
  },
  login(data: { email: string; password: string }) {
    return api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data)
  },
  me() {
    return api.get<ApiResponse<User>>('/auth/me')
  },
}

export const transactionApi = {
  list(filters: Partial<TransactionFilters> = {}) {
    return api.get<PaginatedResponse<Transaction>>('/transactions', { params: filters })
  },
  get(id: number) {
    return api.get<ApiResponse<Transaction>>(`/transactions/${id}`)
  },
  create(data: CreateTransaction) {
    return api.post<ApiResponse<Transaction>>('/transactions', data)
  },
  update(id: number, data: Partial<CreateTransaction>) {
    return api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data)
  },
  delete(id: number) {
    return api.delete<ApiResponse>(`/transactions/${id}`)
  },
}

export const categoryApi = {
  list() {
    return api.get<ApiResponse<Category[]>>('/categories')
  },
  byType(type: 'income' | 'expense') {
    return api.get<ApiResponse<Category[]>>(`/categories/${type}`)
  },
}

export const analyticsApi = {
  dashboard() {
    return api.get<ApiResponse<DashboardStats>>('/analytics/dashboard')
  },
  monthlySummary() {
    return api.get<ApiResponse<any[]>>('/analytics/monthly-summary')
  },
  categoryTrends() {
    return api.get<ApiResponse<any[]>>('/analytics/category-trends')
  },
}

export default api
