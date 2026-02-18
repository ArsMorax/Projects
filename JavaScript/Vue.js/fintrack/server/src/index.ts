import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { ensureDatabase } from './database.js'
import { authenticate } from './middleware/auth.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.routes.js'
import transactionRoutes from './routes/transactions.routes.js'
import categoryRoutes from './routes/categories.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'], credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'FinTrack API is running 🚀', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)

app.use('/api/transactions', authenticate, transactionRoutes)
app.use('/api/categories', authenticate, categoryRoutes)
app.use('/api/analytics', authenticate, analyticsRoutes)

app.use(errorHandler)

async function main() {
  await ensureDatabase()

  app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════╗
  ║   🚀 FinTrack API Server                ║
  ║   Running on http://localhost:${PORT}       ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}            ║
  ╚══════════════════════════════════════════╝
    `)
  })
}

main().catch(console.error)

export default app
