import { Router, Request, Response, NextFunction } from 'express'
import { getTransactions, getCategories } from '../database.js'
import type { TransactionWithCategory, MonthlyData, CategorySummary, DashboardStats } from '../types.js'

const router = Router()

function getYearMonth(dateStr: string): string {
  return dateStr.substring(0, 7)
}

function enrichTransaction(tx: any, categoriesCol: ReturnType<typeof getCategories>): TransactionWithCategory {
  const cat = categoriesCol.findOne({ id: tx.category_id })
  return {
    id: tx.id,
    user_id: tx.user_id,
    type: tx.type,
    amount: tx.amount,
    description: tx.description,
    category_id: tx.category_id,
    date: tx.date,
    created_at: tx.created_at,
    category_name: cat?.name ?? 'Unknown',
    category_icon: cat?.icon ?? '📁',
    category_color: cat?.color ?? '#6366f1',
  }
}

router.get('/dashboard', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const txCol = getTransactions()
    const categoriesCol = getCategories()

    const allTx = txCol.find({ user_id: userId })

    let totalIncome = 0
    let totalExpense = 0
    for (const tx of allTx) {
      if (tx.type === 'income') totalIncome += tx.amount
      else totalExpense += tx.amount
    }

    const balance = totalIncome - totalExpense
    const transactionCount = allTx.length
    const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const sixMonthStr = sixMonthsAgo.toISOString().split('T')[0]

    const recentTx = allTx.filter(t => t.date >= sixMonthStr)

    const monthlyMap = new Map<string, { income: number; expense: number }>()
    for (const tx of recentTx) {
      const month = getYearMonth(tx.date)
      const entry = monthlyMap.get(month) || { income: 0, expense: 0 }
      if (tx.type === 'income') entry.income += tx.amount
      else entry.expense += tx.amount
      monthlyMap.set(month, entry)
    }

    const monthlyTrend: MonthlyData[] = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, income: data.income, expense: data.expense }))

    const currentMonth = new Date().toISOString().substring(0, 7)
    const currentMonthExpenses = allTx.filter(t => t.type === 'expense' && getYearMonth(t.date) === currentMonth)

    const catMap = new Map<number, { total: number; count: number }>()
    for (const tx of currentMonthExpenses) {
      const entry = catMap.get(tx.category_id) || { total: 0, count: 0 }
      entry.total += tx.amount
      entry.count++
      catMap.set(tx.category_id, entry)
    }

    const catTotal = Array.from(catMap.values()).reduce((sum, c) => sum + c.total, 0)
    const categoryBreakdown: CategorySummary[] = Array.from(catMap.entries())
      .map(([catId, data]) => {
        const cat = categoriesCol.findOne({ id: catId })
        return {
          name: cat?.name ?? 'Unknown',
          icon: cat?.icon ?? '📁',
          color: cat?.color ?? '#6366f1',
          total: data.total,
          count: data.count,
          percentage: catTotal > 0 ? Math.round((data.total / catTotal) * 100) : 0,
        }
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 8)

    const sorted = [...allTx].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date)
      return b.created_at.localeCompare(a.created_at)
    })
    const recentTransactions = sorted.slice(0, 8).map(tx => enrichTransaction(tx, categoriesCol))

    const stats: DashboardStats = {
      totalIncome,
      totalExpense,
      balance,
      transactionCount,
      savingsRate,
      monthlyTrend,
      categoryBreakdown,
      recentTransactions,
    }

    res.json({ success: true, data: stats })
  } catch (error) {
    next(error)
  }
})

router.get('/monthly-summary', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const txCol = getTransactions()

    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
    const cutoff = twelveMonthsAgo.toISOString().split('T')[0]

    const allTx = txCol.find({ user_id: userId }).filter(t => t.date >= cutoff)

    const monthlyMap = new Map<string, { income: number; expense: number; transactionCount: number }>()
    for (const tx of allTx) {
      const month = getYearMonth(tx.date)
      const entry = monthlyMap.get(month) || { income: 0, expense: 0, transactionCount: 0 }
      if (tx.type === 'income') entry.income += tx.amount
      else entry.expense += tx.amount
      entry.transactionCount++
      monthlyMap.set(month, entry)
    }

    const data = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, d]) => ({ month, ...d }))

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

router.get('/category-trends', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const txCol = getTransactions()
    const categoriesCol = getCategories()

    const allTx = txCol.find({ user_id: userId })

    const catMap = new Map<number, { total: number; count: number; amounts: number[] }>()
    for (const tx of allTx) {
      const entry = catMap.get(tx.category_id) || { total: 0, count: 0, amounts: [] }
      entry.total += tx.amount
      entry.count++
      entry.amounts.push(tx.amount)
      catMap.set(tx.category_id, entry)
    }

    const data = Array.from(catMap.entries())
      .map(([catId, d]) => {
        const cat = categoriesCol.findOne({ id: catId })
        const average = d.amounts.length > 0 ? d.total / d.amounts.length : 0
        return {
          name: cat?.name ?? 'Unknown',
          icon: cat?.icon ?? '📁',
          color: cat?.color ?? '#6366f1',
          type: cat?.type ?? 'expense',
          total: d.total,
          count: d.count,
          average,
        }
      })
      .sort((a, b) => b.total - a.total)

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

export default router
