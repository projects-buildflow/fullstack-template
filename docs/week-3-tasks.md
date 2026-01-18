# Week 3: Backend & API

**Total XP: 400 | Tasks: 6**

Week 3 focuses on building the backend with a REST API, database integration, and user authentication.

## Overview

| Task | Title | XP | Time | Type |
|------|-------|----|----|------|
| 3.1 | Design Database Schema | 75 | 60 min | PR |
| 3.2 | Build REST API Endpoints | 100 | 90 min | PR |
| 3.3 | Connect Frontend to API | 75 | 60 min | PR |
| 3.4 | Add Error Handling | 50 | 45 min | PR |
| 3.5 | Implement User Authentication | 75 | 90 min | PR |
| 3.6 | API Documentation | 25 | 30 min | AI Review |

## Learning Objectives

By the end of Week 3, you will:

- Design a PostgreSQL database schema
- Build RESTful API endpoints
- Connect frontend to backend API
- Implement JWT authentication
- Document your API

## Key Concepts

### Database Design
- Tables and relationships
- Primary and foreign keys
- Indexes for performance
- Migrations

### REST API
- HTTP methods (GET, POST, PUT, DELETE)
- Route parameters
- Query parameters
- Request/response bodies

### Authentication
- JWT tokens
- Password hashing
- Protected routes
- User sessions

### API Integration
- Fetch API
- Error handling
- Loading states
- Optimistic updates

## Files Created

```
server/
├── index.js              # Express server setup
├── db/
│   ├── index.js          # Database connection
│   ├── schema.sql        # Table definitions
│   └── seed.sql          # Sample data
├── routes/
│   ├── auth.js           # Authentication endpoints
│   ├── tasks.js          # Task CRUD endpoints
│   ├── columns.js        # Column endpoints
│   └── boards.js         # Board endpoints
├── middleware/
│   └── auth.js           # JWT verification
└── docs/
    └── openapi.yaml      # API documentation

src/
├── api/
│   └── client.ts         # API client module
├── context/
│   └── AuthContext.tsx   # Authentication state
└── components/
    ├── ProtectedRoute.tsx
    └── ErrorBoundary.tsx
```

## Getting Started

1. [Task 3.1: Design Database Schema](../week-3/task-3.1/INSTRUCTIONS.md)

Good luck with Week 3!
