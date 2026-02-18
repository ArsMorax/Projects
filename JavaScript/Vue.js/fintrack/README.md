# FinTrack — Smart Personal Finance Dashboard

<div align="center">

**A modern, full-stack personal finance dashboard built with Vue.js 3 + Express.js**

*Glassmorphism UI • Animated Charts • JWT Auth • REST API • Auto-Animate*

</div>

---

## 🔥 Features

### Frontend (Vue.js 3 + TypeScript)
- **Dark glassmorphism UI** — Beautiful frosted glass components with subtle glows
- **Animated transitions** — Page transitions, auto-animated lists, hover effects
- **Interactive charts** — Bar, Line, Doughnut charts with Chart.js
- **Responsive design** — Mobile-first with collapsible sidebar
- **Pinia state management** — Type-safe stores for auth & transactions
- **Real-time search** — Debounced transaction search with filters

### Backend (Express.js + TypeScript)
- **RESTful API** — Clean, well-documented API endpoints
- **JWT Authentication** — Secure token-based auth with bcrypt password hashing
- **LokiJS Database** — Lightweight in-memory document DB with file persistence
- **Zod Validation** — Runtime request validation with detailed error messages
- **Pagination & Filtering** — Flexible query API with sort, search, date range filters
- **Analytics Engine** — Dashboard stats, monthly trends, category breakdowns
- **Demo Data Seeding** — 60 auto-generated transactions for new users

---

## 🏗️ Tech Stack

| Layer        | Technology                                     |
| ------------ | ---------------------------------------------- |
| Frontend     | Vue.js 3, TypeScript, Vite                     |
| Styling      | Tailwind CSS (custom glassmorphism theme)       |
| Charts       | Chart.js + vue-chartjs                          |
| State        | Pinia                                           |
| Animation    | @formkit/auto-animate, CSS transitions          |
| Backend      | Express.js, TypeScript, tsx                     |
| Database     | LokiJS (document DB with file persistence)       |
| Auth         | JWT (jsonwebtoken), bcryptjs                    |
| Validation   | Zod                                             |
| HTTP Client  | Axios                                           |

---

(i used lokijs because i was lazy to install sdk's to use better-sqlite)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Navigate to the project
cd JavaScript/Vue.js/fintrack

# 2. Install all dependencies (root + server + client)
npm run install:all

# 3. Start both servers in development mode
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

### Quick Start
1. Open http://localhost:5173
2. Click **"Create one"** to register a new account
3. 60 demo transactions will be auto-generated!
4. Explore the Dashboard, Transactions, and Analytics pages

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint               | Description              | Auth |
| ------ | --------------------- | ------------------------ | ---- |
| POST   | `/api/auth/register`  | Register new user         | No   |
| POST   | `/api/auth/login`     | Login & get JWT token     | No   |
| GET    | `/api/auth/me`        | Get current user profile  | Yes  |

### Transactions (CRUD)
| Method | Endpoint                 | Description              | Auth |
| ------ | ----------------------- | ------------------------ | ---- |
| GET    | `/api/transactions`     | List (paginated/filtered) | Yes  |
| GET    | `/api/transactions/:id` | Get single transaction    | Yes  |
| POST   | `/api/transactions`     | Create new transaction    | Yes  |
| PUT    | `/api/transactions/:id` | Update transaction        | Yes  |
| DELETE | `/api/transactions/:id` | Delete transaction        | Yes  |

#### Query Parameters for GET /api/transactions
| Param       | Type   | Description                                   |
| ----------- | ------ | --------------------------------------------- |
| page        | number | Page number (default: 1)                       |
| limit       | number | Items per page (default: 20, max: 100)         |
| type        | string | `"income"` or `"expense"`                      |
| category_id | number | Filter by category ID                          |
| search      | string | Search transaction descriptions                |
| from        | string | Start date (YYYY-MM-DD)                        |
| to          | string | End date (YYYY-MM-DD)                          |
| sort        | string | Sort by: `date`, `amount`, `created_at`        |
| order       | string | `asc` or `desc`                                |

### Categories
| Method | Endpoint                  | Description                  | Auth |
| ------ | ------------------------ | ---------------------------- | ---- |
| GET    | `/api/categories`        | List all categories           | Yes  |
| GET    | `/api/categories/:type`  | List by type (income/expense) | Yes  |

### Analytics
| Method | Endpoint                         | Description                          | Auth |
| ------ | ------------------------------- | ------------------------------------ | ---- |
| GET    | `/api/analytics/dashboard`      | Full dashboard stats                  | Yes  |
| GET    | `/api/analytics/monthly-summary`| 12-month income/expense summary       | Yes  |
| GET    | `/api/analytics/category-trends`| All-time category spending analysis   | Yes  |

---

## 📁 Project Structure

```
fintrack/
├── client/                    # Vue.js 3 Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Base components (Button, Input, Modal, etc.)
│   │   │   ├── TransactionForm.vue
│   │   │   └── TransactionItem.vue
│   │   ├── layouts/           # DashboardLayout with sidebar
│   │   ├── views/             # Page components
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── TransactionsView.vue
│   │   │   └── AnalyticsView.vue
│   │   ├── stores/            # Pinia stores
│   │   ├── services/          # API client (Axios)
│   │   ├── types/             # TypeScript types
│   │   ├── router/            # Vue Router config
│   │   └── style.css          # Global styles + Tailwind
│   └── ...config files
│
├── server/                    # Express.js Backend
│   └── src/
│       ├── routes/            # API route handlers
│       │   ├── auth.routes.ts
│       │   ├── transactions.routes.ts
│       │   ├── categories.routes.ts
│       │   └── analytics.routes.ts
│       ├── middleware/         # Auth, validation, error handling
│       ├── database.ts        # LokiJS setup & seeding
│       ├── types.ts           # Shared TypeScript types
│       └── index.ts           # Server entry point
│
└── package.json               # Root (concurrently)
```

---

## 🎨 Design Highlights

- **Glassmorphism cards** with subtle blur and borders
- **Brand gradient** (Indigo → Purple) used throughout
- **Custom scrollbar** styled to match theme
- **Animated stat cards** with hover scale and glow effects
- **Dark-first** design with carefully chosen opacity layers
- **Responsive sidebar** that collapses on mobile
- **Auto-animated lists** for smooth add/remove transitions

---

## License

MIT
