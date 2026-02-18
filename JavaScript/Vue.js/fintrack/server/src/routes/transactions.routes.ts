import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { getTransactions, getCategories, getNextId, saveDatabase } from '../database.js'
import { validate } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import type { TransactionWithCategory } from '../types.js'

const router = Router()

const createSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1).max(200),
  category_id: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
})

const updateSchema = createSchema.partial()

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: z.enum(['income', 'expense']).optional(),
  category_id: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.enum(['date', 'amount', 'created_at']).default('date'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

function enrichTransaction(tx: any): TransactionWithCategory {
  const categoriesCol = getCategories()
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

router.get(
  '/',
  validate(querySchema, 'query'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId
      const { page, limit, type, category_id, search, from, to, sort, order } = req.query as any
      const txCol = getTransactions()

      let results = txCol.find({ user_id: userId })

      if (type) results = results.filter(t => t.type === type)
      if (category_id) results = results.filter(t => t.category_id === Number(category_id))
      if (search) {
        const s = search.toLowerCase()
        results = results.filter(t => t.description.toLowerCase().includes(s))
      }
      if (from) results = results.filter(t => t.date >= from)
      if (to) results = results.filter(t => t.date <= to)

      const sortKey = ['date', 'amount', 'created_at'].includes(sort) ? sort : 'date'
      const desc = order !== 'asc'
      results.sort((a: any, b: any) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal < bVal) return desc ? 1 : -1
        if (aVal > bVal) return desc ? -1 : 1
        return 0
      })

      const total = results.length
      const totalPages = Math.ceil(total / limit)
      const offset = (page - 1) * limit

      const paged = results.slice(offset, offset + limit)
      const enriched = paged.map(enrichTransaction)

      res.json({
        success: true,
        data: enriched,
        meta: { page, limit, total, totalPages },
      })
    } catch (error) {
      next(error)
    }
  }
)

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const txCol = getTransactions()
    const row = txCol.findOne({ id: Number(req.params.id), user_id: req.user!.userId })

    if (!row) {
      throw new AppError(404, 'Transaction not found')
    }

    res.json({ success: true, data: enrichTransaction(row) })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
      return
    }
    next(error)
  }
})

router.post(
  '/',
  validate(createSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, amount, description, category_id, date } = req.body
      const userId = req.user!.userId
      const categoriesCol = getCategories()
      const txCol = getTransactions()

      const cat = categoriesCol.findOne({
        $and: [
          { id: category_id },
          { $or: [{ user_id: null }, { user_id: userId }] },
        ],
      })
      if (!cat) throw new AppError(400, 'Invalid category')

      const newTx = {
        id: getNextId('transactions'),
        user_id: userId,
        type: type as 'income' | 'expense',
        amount,
        description,
        category_id,
        date,
        created_at: new Date().toISOString(),
      }

      txCol.insert(newTx)
      saveDatabase()

      res.status(201).json({ success: true, data: enrichTransaction(newTx), message: 'Transaction created' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message })
        return
      }
      next(error)
    }
  }
)

router.put(
  '/:id',
  validate(updateSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const txCol = getTransactions()
      const userId = req.user!.userId
      const txId = Number(req.params.id)

      const existing = txCol.findOne({ id: txId, user_id: userId })
      if (!existing) throw new AppError(404, 'Transaction not found')

      const fields = req.body
      if (Object.keys(fields).length === 0) {
        throw new AppError(400, 'No fields to update')
      }

      for (const [key, value] of Object.entries(fields)) {
        ;(existing as any)[key] = value
      }

      txCol.update(existing)
      saveDatabase()

      res.json({ success: true, data: enrichTransaction(existing), message: 'Transaction updated' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message })
        return
      }
      next(error)
    }
  }
)

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const txCol = getTransactions()
    const existing = txCol.findOne({ id: Number(req.params.id), user_id: req.user!.userId })

    if (!existing) throw new AppError(404, 'Transaction not found')

    txCol.remove(existing)
    saveDatabase()

    res.json({ success: true, message: 'Transaction deleted' })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
      return
    }
    next(error)
  }
})

export default router
