# Week 4: Polish & Deploy

**Total XP: 400 | Tasks: 6**

Week 4 adds polish features, optimizes performance, and deploys your application to production.

## Overview

| Task | Title | XP | Time | Type |
|------|-------|----|----|------|
| 4.1 | Add Search & Filter | 75 | 60 min | PR |
| 4.2 | Build User Dashboard | 75 | 60 min | AI Review |
| 4.3 | Performance Optimization | 50 | 60 min | PR |
| 4.4 | Responsive Design | 50 | 60 min | PR |
| 4.5 | Deployment Setup | 75 | 60 min | PR |
| 4.6 | Final Presentation | 75 | 60 min | AI Review |

## Learning Objectives

By the end of Week 4, you will:

- Implement search and filtering
- Build a user dashboard with stats
- Optimize React performance
- Create responsive layouts
- Deploy to cloud platforms

## Key Concepts

### Search & Filter
- Text search
- Multiple filter criteria
- Debouncing input
- URL query parameters

### Performance
- React.memo
- useMemo and useCallback
- Code splitting
- Virtual lists

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints
- Touch-friendly UI
- Bottom sheet patterns

### Deployment
- Vercel for frontend
- Railway for backend
- Environment variables
- CI/CD with GitHub Actions

## Files Created

```
src/
├── components/
│   ├── SearchFilterBar.tsx    # Search and filter UI
│   ├── StatsCard.tsx          # Dashboard statistics
│   ├── ProgressChart.tsx      # Weekly progress
│   ├── MobileNav.tsx          # Mobile navigation
│   └── VirtualTaskList.tsx    # Virtualized list
├── pages/
│   └── Dashboard.tsx          # User dashboard
├── hooks/
│   ├── useFilteredTasks.ts    # Filter logic
│   ├── useDebounce.ts         # Debounce hook
│   └── useOnlineStatus.ts     # Offline detection
└── docs/
    └── PRESENTATION.md        # Final presentation

vercel.json                     # Vercel config
.github/
└── workflows/
    └── deploy.yml             # CI/CD workflow
```

## Getting Started

1. [Task 4.1: Add Search & Filter](../week-4/task-4.1/INSTRUCTIONS.md)

Good luck with Week 4!

---

## 🎉 Congratulations!

After completing Week 4, you'll have built a complete full-stack application:

- **Frontend:** React + TypeScript + Tailwind
- **Backend:** Node.js + Express + PostgreSQL
- **Features:** Auth, CRUD, Drag-drop, Search, Dashboard
- **Deployed:** Vercel + Railway + Supabase

**Total XP Earned:** 1,500 XP
