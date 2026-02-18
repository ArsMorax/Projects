import Loki from 'lokijs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', 'fintrack.json')

export interface LokiUser {
  id: number
  name: string
  email: string
  password_hash: string
  avatar_url: string | null
  created_at: string
}

export interface LokiCategory {
  id: number
  user_id: number | null
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

export interface LokiTransaction {
  id: number
  user_id: number
  type: 'income' | 'expense'
  amount: number
  description: string
  category_id: number
  date: string
  created_at: string
}

let db: Loki
let users: Collection<LokiUser>
let categories: Collection<LokiCategory>
let transactions: Collection<LokiTransaction>
let idCounters: { users: number; categories: number; transactions: number }
let initialized = false

function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db = new Loki(DB_PATH, {
      autoload: true,
      autosave: true,
      autosaveInterval: 2000,
      autoloadCallback: (err) => {
        if (err) return reject(err)

        users = db.getCollection<LokiUser>('users') || db.addCollection<LokiUser>('users', { unique: ['email'] })
        categories = db.getCollection<LokiCategory>('categories') || db.addCollection<LokiCategory>('categories')
        transactions = db.getCollection<LokiTransaction>('transactions') || db.addCollection<LokiTransaction>('transactions', { indices: ['user_id', 'date', 'type'] })

        idCounters = {
          users: getMaxId(users),
          categories: getMaxId(categories),
          transactions: getMaxId(transactions),
        }

        seedDefaultCategories()
        initialized = true
        console.log('✅ LokiJS database loaded')
        resolve()
      },
    })
  })
}

function getMaxId<T extends { id: number }>(col: Collection<T>): number {
  const all = col.find()
  if (all.length === 0) return 0
  return Math.max(...all.map(d => d.id))
}

function nextId(collection: 'users' | 'categories' | 'transactions'): number {
  idCounters[collection]++
  return idCounters[collection]
}

export function getUsers() { return users }
export function getCategories() { return categories }
export function getTransactions() { return transactions }
export function getNextId(col: 'users' | 'categories' | 'transactions') { return nextId(col) }
export function saveDatabase() { db.saveDatabase() }

export async function ensureDatabase(): Promise<void> {
  if (!initialized) {
    await initDatabase()
  }
}

function seedDefaultCategories(): void {
  const existing = categories.find({ user_id: null })
  if (existing.length > 0) return

  const defaults: Array<[string, string, string, 'income' | 'expense']> = [
    ['Food & Dining',     '🍔', '#ef4444', 'expense'],
    ['Transportation',    '🚗', '#f97316', 'expense'],
    ['Shopping',          '🛍️', '#eab308', 'expense'],
    ['Entertainment',     '🎮', '#8b5cf6', 'expense'],
    ['Bills & Utilities', '💡', '#06b6d4', 'expense'],
    ['Healthcare',        '🏥', '#10b981', 'expense'],
    ['Education',         '📚', '#3b82f6', 'expense'],
    ['Travel',            '✈️', '#ec4899', 'expense'],
    ['Groceries',         '🛒', '#84cc16', 'expense'],
    ['Subscriptions',     '📱', '#a855f7', 'expense'],
    ['Salary',            '💰', '#10b981', 'income'],
    ['Freelance',         '💻', '#6366f1', 'income'],
    ['Investments',       '📈', '#f59e0b', 'income'],
    ['Side Business',     '🏪', '#14b8a6', 'income'],
    ['Gifts',             '🎁', '#ec4899', 'income'],
    ['Other Income',      '💵', '#8b5cf6', 'income'],
  ]

  for (const [name, icon, color, type] of defaults) {
    categories.insert({ id: nextId('categories'), user_id: null, name, icon, color, type })
  }

  db.saveDatabase()
  console.log('✅ Default categories seeded')
}
