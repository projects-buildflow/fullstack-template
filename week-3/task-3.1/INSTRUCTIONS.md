# Task 3.1: Design Database Schema

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Objective

Design and implement the PostgreSQL database schema for boards, columns, and tasks.

## The Situation

> **Alex Chen (Tech Lead):** "Time to persist our data! We need a proper database schema. Think about relationships, constraints, and indexes. Good schema design now prevents headaches later."

## Requirements

Design a schema with:
- Users table (for authentication)
- Boards table (users can have multiple boards)
- Columns table (boards have columns)
- Tasks table (columns have tasks)
- Proper foreign keys and constraints

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-3.1-database-schema
```

### 2. Set Up PostgreSQL

You have two options:

**Option A: Local PostgreSQL**
```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb taskmaster
```

**Option B: Supabase (Recommended)**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database

### 3. Create Schema File

Create `server/db/schema.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TODO: Create users table
-- Should have: id (UUID PK), email (unique), password_hash, name, avatar_url, created_at, updated_at
-- HINT: Use uuid_generate_v4() for auto-generating UUIDs

-- TODO: Create boards table
-- Should have: id (UUID PK), user_id (FK to users), title, description, is_archived, created_at, updated_at
-- HINT: Use ON DELETE CASCADE for foreign keys

-- TODO: Create columns table
-- Should have: id (UUID PK), board_id (FK to boards), title, color, position, created_at, updated_at
-- HINT: position helps with ordering columns

-- TODO: Create tasks table
-- Should have: id (UUID PK), column_id (FK to columns), title, description, priority, assignee_id (FK to users), due_date, position, created_at, updated_at
-- HINT: Use CHECK constraint for priority values ('low', 'medium', 'high')

-- TODO: Create tags table (optional)
-- Should have: id (UUID PK), board_id (FK to boards), name, color

-- TODO: Create task_tags junction table (optional)
-- Many-to-many relationship between tasks and tags

-- TODO: Add indexes for performance
-- HINT: Index foreign keys and frequently queried columns (user_id, board_id, column_id, due_date)

-- TODO: Create updated_at trigger function
-- This function should set updated_at to NOW() automatically
-- HINT: CREATE OR REPLACE FUNCTION update_updated_at_column()

-- TODO: Apply triggers to all tables
-- Example: CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
```

### 4. Create Seed Data

Create `server/db/seed.sql`:

```sql
-- TODO: Insert demo user
-- Use fixed UUID for testing: '00000000-0000-0000-0000-000000000001'
-- HINT: Password hash can be a placeholder for now

-- TODO: Insert demo board
-- Link to the demo user

-- TODO: Insert default columns
-- Create "To Do", "In Progress", "Done" columns with different colors

-- TODO: Insert sample tasks
-- Add a few tasks to different columns with various priorities

-- TODO: Insert sample tags (optional)
```

### 5. Create Database Connection

Create `server/db/index.js`:

```javascript
const { Pool } = require('pg');

// TODO: Create pool with DATABASE_URL from environment
// HINT: Use process.env.DATABASE_URL

// TODO: Add connection test
// Query 'SELECT NOW()' to verify connection

// TODO: Export query function and pool
// module.exports = { query, pool };
```

### 6. Add Environment Variables

Create `server/.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskmaster
NODE_ENV=development
PORT=3001
```

### 7. Document Your Schema

Create an ER diagram showing relationships:

```
┌───────────┐       ┌───────────┐       ┌───────────┐       ┌───────────┐
│   users   │       │  boards   │       │  columns  │       │   tasks   │
├───────────┤       ├───────────┤       ├───────────┤       ├───────────┤
│ id (PK)   │──┐    │ id (PK)   │──┐    │ id (PK)   │──┐    │ id (PK)   │
│ email     │  │    │ user_id   │◄─┘    │ board_id  │◄─┘    │ column_id │◄─┘
│ password  │  │    │ title     │       │ title     │       │ title     │
│ name      │  │    │ desc      │       │ color     │       │ desc      │
│ avatar    │  └───►│ created   │       │ position  │       │ priority  │
│ created   │       │ updated   │       │ created   │       │ assignee  │
│ updated   │       └───────────┘       └───────────┘       │ due_date  │
└───────────┘                                               │ position  │
      ▲                                                     │ created   │
      └─────────────────────────────────────────────────────│ updated   │
                          (assignee_id FK)                  └───────────┘
```

### 8. Run Migrations

```bash
# Using psql
psql -d taskmaster -f server/db/schema.sql
psql -d taskmaster -f server/db/seed.sql

# Or using npm script (add to package.json)
npm run db:migrate
npm run db:seed
```

### 9. Submit Your PR

```bash
git add .
git commit -m "feat: add database schema for Kanban board"
git push -u origin task-3.1-database-schema
```

## Acceptance Criteria

- [ ] Schema includes users, boards, columns, tasks tables
- [ ] Proper foreign key relationships with CASCADE
- [ ] Indexes on frequently queried columns
- [ ] Auto-updating timestamps with triggers
- [ ] Seed data for testing
- [ ] Database connection module
- [ ] ER diagram in documentation

## Tips

- Use UUIDs instead of auto-increment for distributed systems
- Add `ON DELETE CASCADE` for clean deletions
- Index foreign keys for JOIN performance
- Keep the position field for drag-and-drop ordering

## Key Concepts

**Foreign Keys:** Link tables together (e.g., tasks.column_id references columns.id)
**Indexes:** Speed up queries on frequently searched columns
**Triggers:** Automatically update fields like updated_at
**Constraints:** Enforce data rules (e.g., priority must be low/medium/high)

---

**Previous Task:** [Task 2.6: Keyboard Accessibility](../../week-2/task-2.6/INSTRUCTIONS.md)
**Next Task:** [Task 3.2: Build REST API Endpoints](../task-3.2/INSTRUCTIONS.md)
