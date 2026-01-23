# Task 3.1: Design Database Schema

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
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

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boards table
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Columns table
CREATE TABLE columns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#6366f1', -- Hex color
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table (for task labels)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#gray',
  UNIQUE(board_id, name)
);

-- Task-Tag junction table
CREATE TABLE task_tags (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- Indexes for performance
CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_columns_board_id ON columns(board_id);
CREATE INDEX idx_tasks_column_id ON tasks(column_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_columns_updated_at BEFORE UPDATE ON columns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. Create Seed Data

Create `server/db/seed.sql`:

```sql
-- Insert demo user
INSERT INTO users (id, email, password_hash, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@taskmaster.com', '$2b$10$demo', 'Demo User');

-- Insert demo board
INSERT INTO boards (id, user_id, title, description) VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Project Alpha', 'Main project board');

-- Insert default columns
INSERT INTO columns (id, board_id, title, color, position) VALUES
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'To Do', '#6366f1', 0),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'In Progress', '#f59e0b', 1),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Done', '#22c55e', 2);

-- Insert sample tasks
INSERT INTO tasks (column_id, title, description, priority, position) VALUES
  ('00000000-0000-0000-0000-000000000003', 'Set up project repository', 'Initialize Git repo with proper structure', 'high', 0),
  ('00000000-0000-0000-0000-000000000003', 'Design database schema', 'Create tables for users, boards, tasks', 'high', 1),
  ('00000000-0000-0000-0000-000000000004', 'Build REST API', 'Implement CRUD endpoints', 'medium', 0),
  ('00000000-0000-0000-0000-000000000005', 'Setup development environment', 'Install dependencies and configure tools', 'low', 0);

-- Insert tags
INSERT INTO tags (board_id, name, color) VALUES
  ('00000000-0000-0000-0000-000000000002', 'frontend', '#3b82f6'),
  ('00000000-0000-0000-0000-000000000002', 'backend', '#10b981'),
  ('00000000-0000-0000-0000-000000000002', 'urgent', '#ef4444');
```

### 5. Create Database Connection

Create `server/db/index.js`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected:', res.rows[0].now);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
```

### 6. Add Environment Variables

Create `server/.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskmaster
NODE_ENV=development
PORT=3001
```

### 7. Create ER Diagram

Document your schema with a diagram:

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
- [ ] Proper foreign key relationships
- [ ] Indexes on frequently queried columns
- [ ] Auto-updating timestamps with triggers
- [ ] Seed data for testing
- [ ] Database connection module
- [ ] ER diagram in documentation

## Tips

- Use UUIDs instead of auto-increment for distributed systems
- Add `ON DELETE CASCADE` for clean deletions
- Index foreign keys for JOIN performance

---

**Previous Task:** [Task 2.6: Keyboard Accessibility](../../week-2/task-2.6/INSTRUCTIONS.md)
**Next Task:** [Task 3.2: Build REST API Endpoints](../task-3.2/INSTRUCTIONS.md)
