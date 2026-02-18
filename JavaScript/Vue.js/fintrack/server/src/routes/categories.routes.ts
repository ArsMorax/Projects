import { Router, Request, Response, NextFunction } from 'express'
import { getCategories } from '../database.js'
import type { Category } from '../types.js'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const categoriesCol = getCategories()

    const rows = categoriesCol.find({
      $or: [{ user_id: null }, { user_id: userId }],
    })

    rows.sort((a, b) => {
      if (a.type !== b.type) return a.type.localeCompare(b.type)
      return a.name.localeCompare(b.name)
    })

    const data: Category[] = rows.map(r => ({
      id: r.id,
      user_id: r.user_id,
      name: r.name,
      icon: r.icon,
      color: r.color,
      type: r.type,
    }))

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

router.get('/:type', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params
    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({ success: false, message: 'Type must be "income" or "expense"' })
      return
    }

    const userId = req.user!.userId
    const categoriesCol = getCategories()

    const rows = categoriesCol.find({
      $and: [
        { $or: [{ user_id: null }, { user_id: userId }] },
        { type },
      ],
    })

    rows.sort((a, b) => a.name.localeCompare(b.name))

    const data: Category[] = rows.map(r => ({
      id: r.id,
      user_id: r.user_id,
      name: r.name,
      icon: r.icon,
      color: r.color,
      type: r.type,
    }))

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

export default router
