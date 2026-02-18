export interface User {
  id: number
  name: string
  email: string
  avatar_url: string | null
  created_at: string
}

export interface Transaction {
  id: number
  user_id: number
  type: 'income' | 'expense'
  amount: number
  description: string
  category_id: number
  date: string
  created_at: string
  category_name: string
  category_icon: string
  category_color: string
}

export interface Category {
  id: number
  user_id: number | null
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  balance: number
  transactionCount: number
  savingsRate: number
  monthlyTrend: MonthlyData[]
  categoryBreakdown: CategorySummary[]
  recentTransactions: Transaction[]
}

export interface MonthlyData {
  month: string
  income: number
  expense: number
}

export interface CategorySummary {
  name: string
  icon: string
  color: string
  total: number
  percentage: number
  count: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TransactionFilters {
  page: number
  limit: number
  type?: 'income' | 'expense'
  category_id?: number
  search?: string
  from?: string
  to?: string
  sort: 'date' | 'amount' | 'created_at'
  order: 'asc' | 'desc'
}

export interface CreateTransaction {
  type: 'income' | 'expense'
  amount: number
  description: string
  category_id: number
  date: string
}
