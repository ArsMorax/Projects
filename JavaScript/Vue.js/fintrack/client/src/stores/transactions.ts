import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { transactionApi, categoryApi } from '@/services/api'
import type { Transaction, Category, TransactionFilters, CreateTransaction } from '@/types'

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const totalPages = ref(1)
  const totalItems = ref(0)

  const filters = ref<TransactionFilters>({
    page: 1,
    limit: 15,
    sort: 'date',
    order: 'desc',
  })

  const expenseCategories = computed(() => categories.value.filter(c => c.type === 'expense'))
  const incomeCategories = computed(() => categories.value.filter(c => c.type === 'income'))

  async function fetchTransactions(overrides?: Partial<TransactionFilters>) {
    loading.value = true
    try {
      if (overrides) Object.assign(filters.value, overrides)

      const cleanFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, v]) => v !== undefined && v !== '')
      )

      const { data: res } = await transactionApi.list(cleanFilters)
      transactions.value = res.data
      totalPages.value = res.meta.totalPages
      totalItems.value = res.meta.total
    } finally {
      loading.value = false
    }
  }

  async function createTransaction(data: CreateTransaction) {
    const { data: res } = await transactionApi.create(data)
    if (res.success && res.data) {
      transactions.value.unshift(res.data)
    }
    return res
  }

  async function updateTransaction(id: number, data: Partial<CreateTransaction>) {
    const { data: res } = await transactionApi.update(id, data)
    if (res.success && res.data) {
      const idx = transactions.value.findIndex(t => t.id === id)
      if (idx !== -1) transactions.value[idx] = res.data
    }
    return res
  }

  async function deleteTransaction(id: number) {
    const { data: res } = await transactionApi.delete(id)
    if (res.success) {
      transactions.value = transactions.value.filter(t => t.id !== id)
      totalItems.value--
    }
    return res
  }

  async function fetchCategories() {
    const { data: res } = await categoryApi.list()
    if (res.success && res.data) {
      categories.value = res.data
    }
  }

  function resetFilters() {
    filters.value = { page: 1, limit: 15, sort: 'date', order: 'desc' }
  }

  return {
    transactions,
    categories,
    loading,
    totalPages,
    totalItems,
    filters,
    expenseCategories,
    incomeCategories,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchCategories,
    resetFilters,
  }
})
