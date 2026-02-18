import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getUsers, getCategories, getTransactions, getNextId, saveDatabase } from '../database.js'
import { generateToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import type { User } from '../types.js'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

router.post(
  '/register',
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body
      const usersCol = getUsers()

      const existing = usersCol.findOne({ email })
      if (existing) {
        throw new AppError(409, 'An account with this email already exists')
      }

      const passwordHash = await bcrypt.hash(password, 12)
      const newId = getNextId('users')
      const now = new Date().toISOString()

      usersCol.insert({
        id: newId,
        name,
        email,
        password_hash: passwordHash,
        avatar_url: null,
        created_at: now,
      })
      saveDatabase()

      const user: User = { id: newId, name, email, avatar_url: null, created_at: now }
      const token = generateToken({ userId: user.id, email: user.email })

      seedDemoData(newId)

      res.status(201).json({
        success: true,
        data: { user, token },
        message: 'Account created successfully',
      })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message })
        return
      }
      next(error)
    }
  }
)

router.post(
  '/login',
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body
      const usersCol = getUsers()

      const row = usersCol.findOne({ email })
      if (!row) {
        throw new AppError(401, 'Invalid email or password')
      }

      const valid = await bcrypt.compare(password, row.password_hash)
      if (!valid) {
        throw new AppError(401, 'Invalid email or password')
      }

      const user: User = {
        id: row.id,
        name: row.name,
        email: row.email,
        avatar_url: row.avatar_url,
        created_at: row.created_at,
      }

      const token = generateToken({ userId: user.id, email: user.email })

      res.json({
        success: true,
        data: { user, token },
        message: 'Logged in successfully',
      })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message })
        return
      }
      next(error)
    }
  }
)

router.get('/me', (req: Request, res: Response) => {
  const usersCol = getUsers()
  const row = usersCol.findOne({ id: req.user!.userId })

  if (!row) {
    res.status(404).json({ success: false, message: 'User not found' })
    return
  }

  const user: User = {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar_url: row.avatar_url,
    created_at: row.created_at,
  }

  res.json({ success: true, data: user })
})

function seedDemoData(userId: number): void {
  const categoriesCol = getCategories()
  const transactionsCol = getTransactions()

  const allCats = categoriesCol.find({ user_id: null })
  const expenseCats = allCats.filter(c => c.type === 'expense')
  const incomeCats = allCats.filter(c => c.type === 'income')

  const descriptions = {
    expense: [
      'Coffee at Starbucks', 'Grocery shopping', 'Netflix subscription', 'Gas station',
      'Restaurant dinner', 'Uber ride', 'Amazon purchase', 'Phone bill', 'Gym membership',
      'Movie tickets', 'Pizza delivery', 'Spotify premium', 'New shoes', 'Electricity bill',
      'Hair salon', 'Parking fee', 'Lunch at work', 'Book purchase', 'Dentist visit',
      'Laundry service', 'Metro card', 'Takeout food', 'Video game', 'Pet supplies',
    ],
    income: [
      'Monthly salary', 'Freelance project', 'Stock dividend', 'Side gig payment',
      'Birthday gift', 'Bonus payment', 'Client payment', 'Consulting fee',
    ],
  }

  const today = new Date()
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 180)
    const date = new Date(today)
    date.setDate(date.getDate() - daysAgo)
    const dateStr = date.toISOString().split('T')[0]

    const isIncome = Math.random() < 0.3
    const type = isIncome ? 'income' : 'expense'
    const cats = isIncome ? incomeCats : expenseCats
    const cat = cats[Math.floor(Math.random() * cats.length)]
    const descs = descriptions[type]
    const desc = descs[Math.floor(Math.random() * descs.length)]
    const amount = isIncome
      ? Math.round((Math.random() * 4000 + 1000) * 100) / 100
      : Math.round((Math.random() * 200 + 5) * 100) / 100

    transactionsCol.insert({
      id: getNextId('transactions'),
      user_id: userId,
      type,
      amount,
      description: desc,
      category_id: cat.id,
      date: dateStr,
      created_at: new Date(date.getTime() + Math.random() * 86400000).toISOString(),
    })
  }

  saveDatabase()
}

export default router
