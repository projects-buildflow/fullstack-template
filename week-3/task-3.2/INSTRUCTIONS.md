# Task 3.2: Build REST API Endpoints

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 100 XP | 90 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## Objective

Create CRUD API endpoints for tasks including GET, POST, PUT, DELETE operations.

## The Situation

> **Sarah Johnson (Frontend Developer):** "Time to build the API! We need RESTful endpoints that follow best practices. Think about error handling, validation, and consistent response formats."

## Requirements

Build a REST API with:
- Express.js server setup
- CRUD endpoints for tasks
- Input validation
- Consistent error handling
- JSON responses

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-3.2-rest-api
```

### 2. Install Dependencies

```bash
cd server
npm init -y
npm install express cors dotenv pg
npm install -D nodemon
```

### 3. Create Express Server

Create `server/index.js`:

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Add middleware
// HINT: app.use(cors()), app.use(express.json())

// TODO: Add request logging middleware
// Log method and path for each request

// TODO: Mount routes
// app.use('/api/tasks', require('./routes/tasks'));
// app.use('/api/columns', require('./routes/columns'));

// TODO: Add health check endpoint
// GET /health should return { status: 'ok', timestamp: ... }

// TODO: Add error handling middleware
// Catch errors and return consistent JSON format

// TODO: Add 404 handler
// Return { error: { message: 'Not found', status: 404 } }

// TODO: Start server
// app.listen(PORT, ...)
```

### 4. Create Tasks Router

Create `server/routes/tasks.js`:

```javascript
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/tasks - Get all tasks (with optional column filter)
router.get('/', async (req, res, next) => {
  try {
    // TODO: Get column_id from query params

    // TODO: Build SQL query
    // SELECT t.*, u.name as assignee_name FROM tasks t
    // LEFT JOIN users u ON t.assignee_id = u.id
    // Add WHERE clause if column_id provided

    // TODO: Execute query with db.query()

    // TODO: Return { tasks: result.rows }
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res, next) => {
  try {
    // TODO: Get id from req.params

    // TODO: Query task by id with JOIN to users

    // TODO: If not found, return 404

    // TODO: Return { task: result.rows[0] }
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res, next) => {
  try {
    // TODO: Destructure column_id, title, description, priority, assignee_id, due_date from req.body

    // TODO: Validate required fields (column_id, title)
    // Return 400 if missing

    // TODO: Get max position for the column
    // SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM tasks WHERE column_id = $1

    // TODO: Insert new task with calculated position
    // INSERT INTO tasks (...) VALUES (...) RETURNING *

    // TODO: Return 201 with { task: result.rows[0] }
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res, next) => {
  try {
    // TODO: Get id from params and updates from body

    // TODO: Check if task exists

    // TODO: Update task with COALESCE for optional fields
    // UPDATE tasks SET title = COALESCE($1, title), ... WHERE id = $8 RETURNING *

    // TODO: Return { task: result.rows[0] }
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res, next) => {
  try {
    // TODO: Delete task and return deleted row
    // DELETE FROM tasks WHERE id = $1 RETURNING *

    // TODO: If no rows, return 404

    // TODO: Return success message
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id/move - Move task to different column
router.patch('/:id/move', async (req, res, next) => {
  try {
    // TODO: Get column_id and position from body

    // TODO: Update task's column_id and position

    // TODO: Return updated task
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

### 5. Create Columns Router

Create `server/routes/columns.js`:

```javascript
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/columns?board_id=xxx
router.get('/', async (req, res, next) => {
  try {
    // TODO: Require board_id query param (400 if missing)

    // TODO: Query columns for board, ordered by position

    // TODO: Return { columns: result.rows }
  } catch (err) {
    next(err);
  }
});

// POST /api/columns
router.post('/', async (req, res, next) => {
  try {
    // TODO: Get board_id, title, color from body

    // TODO: Validate required fields

    // TODO: Get next position for board

    // TODO: Insert column and return 201
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

### 6. Add npm Scripts

Update `server/package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "db:migrate": "psql $DATABASE_URL -f db/schema.sql",
    "db:seed": "psql $DATABASE_URL -f db/seed.sql"
  }
}
```

### 7. Test Your API

```bash
# Start the server
npm run dev

# Test endpoints with curl
curl http://localhost:3001/health

curl http://localhost:3001/api/tasks

curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"column_id": "xxx", "title": "New Task"}'
```

### 8. Submit Your PR

```bash
git add .
git commit -m "feat: add REST API endpoints for tasks and columns"
git push -u origin task-3.2-rest-api
```

## Acceptance Criteria

- [ ] GET /api/tasks returns all tasks
- [ ] GET /api/tasks/:id returns single task
- [ ] POST /api/tasks creates new task with validation
- [ ] PUT /api/tasks/:id updates task
- [ ] DELETE /api/tasks/:id deletes task
- [ ] PATCH /api/tasks/:id/move changes column
- [ ] Proper error responses (400, 404, 500)
- [ ] Input validation on required fields

## Tips

- Use COALESCE for partial updates in PUT requests
- Always return the modified resource after changes
- Add proper HTTP status codes (200, 201, 400, 404, 500)
- Validate input before database operations

## REST API Conventions

- **GET** - Retrieve resource(s)
- **POST** - Create new resource (return 201)
- **PUT** - Update entire resource
- **PATCH** - Update partial resource
- **DELETE** - Remove resource

---

**Previous Task:** [Task 3.1: Design Database Schema](../task-3.1/INSTRUCTIONS.md)
**Next Task:** [Task 3.3: Connect Frontend to API](../task-3.3/INSTRUCTIONS.md)
