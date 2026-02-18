export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  features: string[];
  category: "fullstack" | "frontend" | "backend" | "tool";
  highlights: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: "luxura",
    title: "Luxura",
    subtitle: "E-Commerce Platform",
    description:
      "A full-blown e-commerce platform I built using Laravel and React through Inertia.js. It handles everything from user auth and product browsing to cart, checkout, wishlists, and even product reviews.",
    longDescription: `Luxura is probably the most ambitious project I've worked on so far. I wanted to build a real, complete e-commerce platform, not just a tutorial-level CRUD app, but something that actually covers the full shopping experience from start to finish.

The backend runs on Laravel 12 with 10 Eloquent models covering users, products, categories, carts, orders, reviews, and wishlists. I set up role-based access so regular users and admins have different permissions. Authentication is handled through Laravel Breeze and Sanctum, which made the auth flow pretty smooth to implement.

For the frontend, I went with React 18 and TypeScript connected through Inertia.js. This gave me that single-page app feel without needing a separate API layer. The UI uses Radix UI components for accessibility and Framer Motion for some nice transitions. Everything is styled with Tailwind CSS.

The database has 12 migrations covering everything from the basic user and product tables to more complex stuff like order items, product images, and review systems. I also wrote seeders so you can spin up the project with sample data right away.

What I'm most proud of here is the scope. It's got product image galleries, a working wishlist system, a review system with ratings, a full cart-to-checkout-to-order pipeline, and user profile management. It taught me a lot about structuring a larger Laravel application and managing complex relationships between models.`,
    image: "/images/luxura.svg",
    technologies: [
      "Laravel 12",
      "PHP 8.2",
      "React 18",
      "TypeScript",
      "Inertia.js",
      "Tailwind CSS",
      "MySQL",
      "Sanctum",
      "Radix UI",
      "Framer Motion",
    ],
    features: [
      "Full authentication with role-based access",
      "Product catalog with categories & image galleries",
      "Shopping cart with real-time updates",
      "Checkout & order management system",
      "Wishlist & product review system",
      "12 database migrations with seeders",
    ],
    category: "fullstack",
    highlights: "10 Models · 8+ Controllers · 12 Migrations",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "t3-ecommerce",
    title: "T3 E-Commerce",
    subtitle: "Type-Safe Online Store",
    description:
      "An online store built with the T3 Stack where everything is type-safe from the database all the way to the frontend. Uses tRPC, Prisma, and NextAuth to keep things clean and reliable.",
    longDescription: `This project was my deep dive into the T3 Stack, and honestly it changed how I think about building web apps. The whole idea behind this stack is that your types flow from the database schema through your API all the way to the React components, so if something breaks, TypeScript catches it before it ever hits production.

I built it on Next.js 15 with React 19 and used tRPC for the API layer. Instead of writing REST endpoints and manually typing request/response objects, tRPC lets you define procedures on the server and call them directly from the client with full autocompletion and type checking. It sounds like magic until you try it and realize it just makes sense.

The database layer uses Prisma with MySQL. The schema covers products (with images, ratings, stock, and a featured flag), categories, cart items, orders with line items, and users with auth sessions. I wrote a seed script that populates the database with realistic demo data so anyone cloning the repo can see it in action immediately.

Authentication is handled by NextAuth with both credentials-based login (email + password with bcrypt hashing) and OAuth support. The UI is built with Radix UI primitives for things like dialogs, selects, toasts, and dropdown menus, plus Framer Motion for animations.

The shopping flow works end to end: browse products, filter by category, view details, add to cart (there's a slide-out cart sheet), go through checkout, and then view your order history. I also added Zod validation on the tRPC procedures so the inputs are validated at runtime too.

Building this really solidified my understanding of type-safe full-stack development, and it's now my go-to architecture when I want maximum developer experience.`,
    image: "/images/t3-ecommerce.svg",
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "tRPC",
      "Prisma",
      "NextAuth",
      "MySQL",
      "Tailwind CSS",
      "Radix UI",
      "Framer Motion",
      "Zod",
    ],
    features: [
      "End-to-end type safety with tRPC",
      "Authentication (credentials + OAuth)",
      "Product browsing with categories & featured items",
      "Cart sheet with real-time management",
      "Complete checkout to order flow",
      "Prisma seed script for demo data",
    ],
    category: "fullstack",
    highlights: "T3 Stack · tRPC · End-to-End Type Safety",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "fintrack",
    title: "FinTrack",
    subtitle: "Personal Finance Dashboard",
    description:
      "A finance tracking dashboard with a Vue.js frontend and Express.js backend. You can log transactions, view spending analytics through charts, and it auto-generates demo data for new accounts.",
    longDescription: `FinTrack started because I wanted to build something practical that I could actually use, and tracking where my money goes felt like a solid idea. It's a full-stack app with a Vue.js 3 frontend and an Express.js backend, set up as a monorepo.

The frontend is built with Vue 3 using the Composition API and TypeScript. State management uses Pinia, and the charts are powered by Chart.js through vue-chartjs. There's a main dashboard that shows your financial overview with stats cards and both bar and doughnut charts for spending breakdowns.

The transactions page is where most of the action happens. You can create, edit, and delete transactions, search through them, filter by category or date range, and it's all paginated so it doesn't get slow with lots of data. The analytics page goes deeper with monthly trend analysis and category-by-category breakdowns.

On the backend, Express handles the REST API with JWT authentication. I used LokiJS as the database, which is basically an in-memory document store that persists to disk. It's lightweight and perfect for a project like this where you don't need a full SQL setup. All request bodies are validated with Zod so bad data gets rejected early.

One thing I'm happy with is the onboarding experience. When a new user registers, the backend automatically seeds their account with 60 realistic transactions across different categories so the dashboard and charts aren't empty on first login. It makes the app feel alive right away.

The whole thing has a dark glassmorphism design with smooth transitions using FormKit's auto-animate. Both the client and server start together with concurrently, and the README documents every API endpoint.`,
    image: "/images/fintrack.svg",
    technologies: [
      "Vue.js 3",
      "TypeScript",
      "Pinia",
      "Chart.js",
      "Tailwind CSS",
      "Express.js",
      "JWT",
      "LokiJS",
      "Zod",
      "Axios",
    ],
    features: [
      "JWT authentication with register/login flow",
      "Transaction CRUD with search & filtering",
      "Interactive bar & doughnut charts",
      "Monthly trends & category analytics",
      "Auto-seeded demo data (60 transactions)",
      "Glassmorphism dark UI design",
    ],
    category: "fullstack",
    highlights: "Monorepo · REST API · Data Visualization",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "storehub",
    title: "StoreHub",
    subtitle: "Product Inventory Manager",
    description:
      "An inventory management app built with Go and MySQL. Has a clean dark UI with dashboard stats, product search, and CRUD operations. My first real project using Go for the backend.",
    longDescription: `StoreHub was my way of learning Go for web development. I'd been writing Go scripts for concurrency experiments and kept hearing that Go is great for building web servers, so I decided to put that to the test by building something visual and functional.

It's a product inventory management app. The Go backend serves an HTML page that's styled with Tailwind CSS (through CDN) and uses a dark glassmorphism design that I'm pretty happy with. The UI has a sidebar navigation, a dashboard with stats cards showing total products, total stock, and total inventory value, and a main product table with search filtering.

The backend connects to a MySQL database and reads product data using Go's database/sql package with the go-sql-driver. On the frontend side, the CRUD operations (add, edit, delete) are handled through client-side JavaScript with confirmation modals and edit forms built right into the page.

I also added some nice touches like Rupiah and USD currency formatting, a clean search bar that filters products in real time, and responsive design so it works on smaller screens.

This project taught me a lot about Go's http package, template rendering, working with MySQL from Go, and how Go handles errors differently from languages I'm used to. It's simpler in scope than my other projects, but it's the one that pushed me outside my comfort zone the most.`,
    image: "/images/storehub.svg",
    technologies: [
      "Go",
      "MySQL",
      "HTML/CSS",
      "Tailwind CSS",
      "JavaScript",
    ],
    features: [
      "Go HTTP server with MySQL integration",
      "Dashboard with stats cards",
      "Product search & filtering",
      "CRUD operations with modals",
      "Glassmorphism dark theme UI",
      "Multi-currency formatting",
    ],
    category: "fullstack",
    highlights: "Go Backend · MySQL · Dark Glassmorphism UI",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "manhwa-scraper",
    title: "Manhwa Scraper",
    subtitle: "Web Scraping CLI Tool",
    description:
      "A 600+ line Python CLI tool that downloads manhwa chapters using headless browser automation. Handles lazy-loaded images, does image upscaling, and has a neat interactive menu.",
    longDescription: `This one's a bit different from my web projects. I read a lot of manhwa and wanted a way to download chapters for offline reading, so I built a CLI scraper for it. It turned into a pretty substantial Python project at over 600 lines.

The scraper uses Playwright to control a headless Chromium browser. I went with full browser automation instead of just HTTP requests because the sites I'm scraping use JavaScript-heavy rendering and lazy-loaded images that only appear when you scroll down. So the scraper actually scrolls through each page to trigger all the image loads before downloading them.

To avoid getting blocked, I implemented several stealth techniques: rotating user agents, blocking unnecessary resources like fonts and stylesheets to speed things up, and adding realistic delays between actions. There's also retry logic with exponential backoff for when requests fail.

The image processing pipeline was a fun part to build. After downloading, each image goes through Pillow (Python's image library) where it gets upscaled if it's below 800 pixels wide and then sharpened. This makes the reading experience noticeably better, especially on larger screens.

The CLI interface has an ASCII art banner because why not, and a menu system that lets you browse popular titles (by week, month, or all time), check latest updates, search for specific manhwa, and then select which chapters to download. The chapter selection is flexible too, so you can do ranges like "1-10", specific chapters like "5,10,15", or just "all".

It's probably not the most portfolio-friendly project since it's a scraper, but I learned a ton about browser automation, image processing, and building interactive CLI tools with Python.`,
    image: "/images/manhwa-scraper.svg",
    technologies: [
      "Python",
      "Playwright",
      "Pillow",
      "Requests",
      "Regex",
    ],
    features: [
      "Headless Chromium browser automation",
      "Stealth techniques (user agent, resource blocking)",
      "Image upscaling & sharpening pipeline",
      "Flexible chapter range selection",
      "Interactive CLI menu with ASCII art",
      "Retry logic & error handling",
    ],
    category: "tool",
    highlights: "600+ Lines · Playwright · Image Processing",
    color: "from-orange-500 to-amber-600",
  },
];
