# TaskMaster - Full-Stack Virtual Internship

Welcome to **TaskMaster**, a productivity software company! Over the next 4 weeks, you'll build a **Kanban board application** from scratch, learning full-stack development with React and Node.js.

## Your Mission

TaskMaster is preparing to launch their next-generation task management platform. As a new engineering intern, you'll be building core features for the Kanban board that will help thousands of teams stay organized.

## Project Structure

```
taskmaster/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and helpers
│   └── api/                # API client functions
├── server/                 # Backend Node.js/Express application
│   ├── routes/             # API route handlers
│   ├── db/                 # Database configuration
│   └── middleware/         # Express middleware
├── scripts/                # Utility scripts
├── week-1/                 # Week 1 task instructions
├── week-2/                 # Week 2 task instructions
├── week-3/                 # Week 3 task instructions
├── week-4/                 # Week 4 task instructions
└── docs/                   # Documentation
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

Frontend will be available at: http://localhost:3000

### 4. Verify Setup (Task 1.1)

```bash
npm run verify
```

If successful, you'll receive a verification token to submit.

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **dnd-kit** - Drag and drop

### Backend (Week 3+)
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
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
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run lint` | Check code style |
| `npm run verify` | Verify setup (Task 1.1) |
| `npm run server` | Start backend server (Week 3+) |

## Getting Help

### Team Contacts (AI Personas)

- **Alex Chen** (Tech Lead) - Architecture questions, code reviews
- **Sarah Johnson** (Senior Frontend Developer) - UI/UX, React patterns, accessibility
- **Marcus Williams** (Backend Engineer) - API design, database, Node.js
- **Jamie Park** (Product Designer) - Requirements, UX feedback, design decisions

### Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Express.js](https://expressjs.com/)

## Submitting Your Work

### Token Tasks (Setup)
Run the verify script and submit the token:
- **Discord:** `/submit TASKMASTER-YOUR-TOKEN`
- **Web Portal:** Tasks page > Submit Token

### PR Tasks (Code)
1. Create a new branch: `git checkout -b task-X.Y`
2. Make your changes
3. Push: `git push -u origin task-X.Y`
4. Create a Pull Request on GitHub
5. AI review will automatically run

## Troubleshooting

### "npm install" fails
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- --port 3001
```

### TypeScript errors
```bash
# Check for type issues
npm run lint
```

### Can't connect to backend (Week 3+)
- Make sure backend is running: `npm run server`
- Check `.env` file has correct `DATABASE_URL`

---

**Ready to start?** Head to [Week 1, Task 1.1: Environment Setup](./week-1/task-1.1/INSTRUCTIONS.md)

Good luck, and welcome to TaskMaster!
