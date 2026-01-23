# Task 3.2: Build REST API Endpoints

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 100 XP | 90 min | Pull Request |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
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

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/columns', require('./routes/columns'));
app.use('/api/boards', require('./routes/boards'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Not found',
      status: 404,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
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
    const { column_id } = req.query;

    let query = `
      SELECT t.*, u.name as assignee_name, u.avatar_url as assignee_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assignee_id = u.id
    `;
    const params = [];

    if (column_id) {
      query += ' WHERE t.column_id = $1';
      params.push(column_id);
    }

    query += ' ORDER BY t.position ASC';

    const result = await db.query(query, params);
    res.json({ tasks: result.rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT t.*, u.name as assignee_name, u.avatar_url as assignee_avatar
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { message: 'Task not found', status: 404 },
      });
    }

    res.json({ task: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res, next) => {
  try {
    const { column_id, title, description, priority, assignee_id, due_date } = req.body;

    // Validation
    if (!column_id || !title) {
      return res.status(400).json({
        error: { message: 'column_id and title are required', status: 400 },
      });
    }

    // Get max position in column
    const posResult = await db.query(
      'SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM tasks WHERE column_id = $1',
      [column_id]
    );
    const position = posResult.rows[0].next_pos;

    const result = await db.query(
      `INSERT INTO tasks (column_id, title, description, priority, assignee_id, due_date, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [column_id, title, description, priority || 'medium', assignee_id, due_date, position]
    );

    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, priority, assignee_id, due_date, column_id, position } = req.body;

    // Check task exists
    const existing = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        error: { message: 'Task not found', status: 404 },
      });
    }

    const result = await db.query(
      `UPDATE tasks SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        priority = COALESCE($3, priority),
        assignee_id = $4,
        due_date = $5,
        column_id = COALESCE($6, column_id),
        position = COALESCE($7, position)
       WHERE id = $8
       RETURNING *`,
      [title, description, priority, assignee_id, due_date, column_id, position, id]
    );

    res.json({ task: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { message: 'Task not found', status: 404 },
      });
    }

    res.json({ message: 'Task deleted', task: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id/move - Move task to different column
router.patch('/:id/move', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { column_id, position } = req.body;

    if (!column_id) {
      return res.status(400).json({
        error: { message: 'column_id is required', status: 400 },
      });
    }

    const result = await db.query(
      `UPDATE tasks SET column_id = $1, position = $2 WHERE id = $3 RETURNING *`,
      [column_id, position || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { message: 'Task not found', status: 404 },
      });
    }

    res.json({ task: result.rows[0] });
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
    const { board_id } = req.query;
    if (!board_id) {
      return res.status(400).json({
        error: { message: 'board_id is required', status: 400 },
      });
    }

    const result = await db.query(
      'SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC',
      [board_id]
    );

    res.json({ columns: result.rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/columns
router.post('/', async (req, res, next) => {
  try {
    const { board_id, title, color } = req.body;

    if (!board_id || !title) {
      return res.status(400).json({
        error: { message: 'board_id and title are required', status: 400 },
      });
    }

    const posResult = await db.query(
      'SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM columns WHERE board_id = $1',
      [board_id]
    );

    const result = await db.query(
      'INSERT INTO columns (board_id, title, color, position) VALUES ($1, $2, $3, $4) RETURNING *',
      [board_id, title, color || '#6366f1', posResult.rows[0].next_pos]
    );

    res.status(201).json({ column: result.rows[0] });
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
- [ ] POST /api/tasks creates new task
- [ ] PUT /api/tasks/:id updates task
- [ ] DELETE /api/tasks/:id deletes task
- [ ] PATCH /api/tasks/:id/move changes column
- [ ] Proper error responses (400, 404, 500)
- [ ] Input validation on required fields

## Tips

- Use COALESCE for partial updates
- Return the modified resource after changes
- Add proper HTTP status codes

---

**Previous Task:** [Task 3.1: Design Database Schema](../task-3.1/INSTRUCTIONS.md)
**Next Task:** [Task 3.3: Connect Frontend to API](../task-3.3/INSTRUCTIONS.md)
