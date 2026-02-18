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
      "A comprehensive full-scale e-commerce platform built with Laravel and React via Inertia.js. Features 10 Eloquent models, role-based access control, product catalog with image galleries, shopping cart, checkout flow, order management, wishlists, product reviews, and user authentication with Laravel Breeze + Sanctum.",
    longDescription:
      "Luxura is the biggest project I've built so far. It's a full e-commerce platform where I connected Laravel on the backend with React on the frontend using Inertia.js, so everything feels like a single-page app but still has all the server-side power of Laravel behind it.\n\nI designed 10 Eloquent models, wrote 12 migrations, and set up proper relationships between users, products, categories, orders, wishlists, and reviews. The auth system uses Laravel Breeze with Sanctum, and I built role-based access so admins and regular users see different things.\n\nOn the frontend, I used Radix UI for accessible components and Framer Motion for animations. The product pages have image galleries, the cart updates in real time, and the checkout flow handles everything from address entry to order confirmation.",
    image: "/images/luxura_img.jpeg",
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
      "A full-featured e-commerce web application built with the T3 Stack. End-to-end type safety with tRPC, Prisma ORM for database management, and NextAuth for authentication. Includes product browsing, cart management, checkout flow, order history, and a seed script to populate data.",
    longDescription:
      "This project was my deep dive into the T3 Stack. I wanted to experience what end-to-end type safety actually feels like, and building a full e-commerce app seemed like the best way to push it.\n\nThe backend uses tRPC, so every API call is fully typed from the server to the client with zero code generation. Prisma handles the database layer, and I set up NextAuth for authentication with both credential-based login and OAuth. The schema covers products, categories, carts, orders, and users.\n\nThe frontend is built with Next.js 15 and React 19. I added Radix UI for accessible dialogs and dropdowns, Framer Motion for page transitions, and Zod for runtime validation on forms. There's also a seed script that populates the database with demo products so you can see everything working right away.",
    image: "/images/t3_img.jpeg",
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
      "A full-stack personal finance dashboard with Vue.js frontend and Express.js backend. Features JWT authentication, transaction CRUD with search/filter/pagination, interactive charts (bar & doughnut) for analytics, monthly trends, category breakdowns, and automatic demo data seeding for new users.",
    longDescription:
      "FinTrack is a personal finance dashboard I built as a monorepo with a Vue.js 3 frontend and an Express.js backend. I wanted to practice building a complete full-stack app with proper auth and data visualization.\n\nThe backend uses JWT for authentication and LokiJS as an in-memory database. I built a REST API with full CRUD for transactions, plus endpoints for analytics data. When a new user registers, the server automatically seeds 60 demo transactions so the dashboard isn't empty.\n\nThe frontend uses Pinia for state management, Chart.js for interactive bar and doughnut charts, and Tailwind CSS for a glassmorphism dark theme. You can search and filter transactions, view monthly spending trends, and see category breakdowns. I also added Zod for input validation on both ends.",
    image: "/images/vue_img.jpeg",
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
      "A product inventory management web application built with Go and MySQL. Features a polished dark glassmorphism UI with Tailwind CSS, dashboard stats cards (total products, stock, inventory value), product search filtering, CRUD operations with confirmation modals, and Rupiah/USD currency formatting.",
    longDescription:
      "StoreHub is a product inventory manager I built to learn Go for web development. The backend is a Go HTTP server connected to MySQL, and the frontend is server-rendered HTML with Tailwind CSS and vanilla JavaScript.\n\nThe dashboard shows stats cards for total products, total stock, and inventory value. There's a product list with search filtering and full CRUD operations. I added confirmation modals for delete actions and built a form system for creating and editing products.\n\nOne thing I liked building was the multi-currency formatting. It displays prices in both Rupiah and USD, which was a nice exercise in localization. The whole UI uses a dark glassmorphism theme that I styled from scratch with Tailwind.",
    image: "/images/go_img.jpeg",
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
      "A 600+ line Python CLI tool for downloading manhwa chapters from the web. Uses Playwright for headless browser automation with stealth techniques, Pillow for image processing (upscaling & sharpening), supports browsing popular titles, batch chapter downloading with flexible range selection, and a polished interactive CLI menu with ASCII art.",
    longDescription:
      "This started as a personal tool because I read a lot of manhwa and wanted a better way to download chapters for offline reading. It ended up being over 600 lines of Python and taught me a ton about web scraping and browser automation.\n\nThe scraper uses Playwright to run a headless Chromium browser with stealth techniques like custom user agents and resource blocking to avoid detection. It can browse popular titles, let you pick a series, and then batch-download chapters with flexible range selection.\n\nAfter downloading, each image goes through a processing pipeline using Pillow. It upscales low-resolution panels and applies sharpening filters so the final result looks clean. The whole thing runs through an interactive CLI menu with ASCII art headers, progress bars, and retry logic for flaky connections.",
    image: "/images/scrapper_img.jpeg",
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
