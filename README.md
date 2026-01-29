# TaskMaster - Full-Stack Virtual Internship

Welcome to **TaskMaster**, a productivity software company! Over the next 4 weeks, you'll build a **Kanban board application** from scratch, learning full-stack development with Next.js.

## Your Mission

TaskMaster is preparing to launch their next-generation task management platform. As a new engineering intern, you'll be building core features for the Kanban board that will help thousands of teams stay organized.

## Project Structure

```
taskmaster/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── api/                # API routes (Week 3+)
├── components/             # Reusable UI components
├── lib/                    # Utilities and helpers
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom hooks
│   └── api/                # API client functions
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
└── scripts/                # Utility scripts
```

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (recommended) with these extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets

## Quick Start

### 1. Clone Your Repository

```bash
git clone <your-repo-url>
cd taskmaster-<your-username>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

App will be available at: http://localhost:3000

### 4. Verify Setup (Task 1.1)

```bash
npm run verify
```

If successful, you'll receive a verification token to submit.

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Backend (Week 3+)
- **Next.js API Routes** - Backend endpoints
- **PostgreSQL** - Database (via Supabase)
- **JWT** - Authentication

## Weekly Overview

### Week 1: Setup & Foundations (300 XP)
Build the core UI components for the Kanban board - buttons, cards, columns.

### Week 2: State & Interactivity (400 XP)
Add state management, CRUD operations, and drag-and-drop functionality.

### Week 3: Backend & API (400 XP)
Build the REST API, connect to a database, add authentication.

### Week 4: Polish & Deploy (400 XP)
Add search/filters, optimize performance, deploy to production.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run tests |
| `npm run lint` | Check code style |
| `npm run verify` | Verify setup (Task 1.1) |

## Getting Help

### Team Contacts (AI Personas)

- **Alex Chen** (Tech Lead) - Architecture questions, code reviews
- **Sarah Johnson** (Senior Frontend Developer) - UI/UX, React patterns
- **Marcus Williams** (Backend Engineer) - API design, database
- **Jamie Park** (Product Designer) - Requirements, UX feedback

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Submitting Your Work

### Token Tasks (Setup)
Run the verify script and submit the token in your dashboard.

### PR Tasks (Code)
1. Create a new branch: `git checkout -b task-X.Y-description`
2. Make your changes
3. Push: `git push -u origin task-X.Y-description`
4. Create a Pull Request on GitHub
5. AI review will automatically run

## Troubleshooting

### "npm install" fails
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### TypeScript errors
```bash
npm run lint
```

---

**Ready to start?** Run `npm run verify` to complete Task 1.1!

Good luck, and welcome to TaskMaster!
