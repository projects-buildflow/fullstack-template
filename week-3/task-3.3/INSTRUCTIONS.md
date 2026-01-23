# Task 3.3: Connect Frontend to API

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Objective

Integrate the frontend with your REST API, replacing mock data with real API calls.

## The Situation

> **Sarah Johnson (Frontend Developer):** "The API is ready, now let's connect it to the frontend. We'll create an API client module and update our context to fetch and persist data. Remember to handle loading and error states!"

## Requirements

Connect frontend to API:
- Create API client module
- Replace mock data with API calls
- Add loading states
- Handle API errors gracefully
- Sync state with backend

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-3.3-connect-api
```

### 2. Create API Client

Create `src/api/client.ts`:

```typescript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // TODO: Build full URL with API_BASE + endpoint

  // TODO: Make fetch request with JSON headers

  // TODO: Check if response.ok, if not throw ApiError

  // TODO: Parse and return JSON
}

export const api = {
  // Tasks
  getTasks: (columnId?: string) => {
    // TODO: Fetch tasks, optionally filtered by column
    // HINT: Use query param ?column_id=${columnId}
  },

  getTask: (id: string) => {
    // TODO: Fetch single task by id
  },

  createTask: (task: CreateTaskInput) => {
    // TODO: POST to /tasks with task data
  },

  updateTask: (id: string, updates: Partial<Task>) => {
    // TODO: PUT to /tasks/:id with updates
  },

  deleteTask: (id: string) => {
    // TODO: DELETE /tasks/:id
  },

  moveTask: (id: string, columnId: string, position?: number) => {
    // TODO: PATCH /tasks/:id/move
  },

  // Columns
  getColumns: (boardId: string) => {
    // TODO: GET /columns?board_id=xxx
  },
};

// TODO: Define CreateTaskInput interface
interface CreateTaskInput {
  column_id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee_id?: string;
  due_date?: string;
}

export { ApiError };
```

### 3. Update Board Context for API

Update `src/context/BoardContext.tsx`:

```typescript
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { api, ApiError } from '../api/client';

interface BoardState {
  columns: Column[];
  tasks: Record<string, Task>;
  isLoading: boolean;
  error: string | null;
}

// TODO: Define BoardAction types
// SET_LOADING, SET_ERROR, SET_DATA, ADD_TASK, UPDATE_TASK, DELETE_TASK, MOVE_TASK

const initialState: BoardState = {
  columns: [],
  tasks: {},
  isLoading: true,
  error: null,
};

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  // TODO: Handle each action type
  switch (action.type) {
    case 'SET_LOADING':
      // Return state with isLoading updated

    case 'SET_ERROR':
      // Return state with error and isLoading: false

    case 'SET_DATA':
      // Transform tasks array to Record<string, Task>
      // Update columns with taskIds arrays

    case 'ADD_TASK':
      // Add task to tasks record
      // Add task.id to appropriate column's taskIds

    // TODO: Implement UPDATE_TASK, DELETE_TASK, MOVE_TASK

    default:
      return state;
  }
}

export function BoardProvider({ boardId, children }: { boardId: string; children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // TODO: Fetch initial data on mount
  const fetchData = async () => {
    // Set loading true
    // Fetch columns and tasks in parallel with Promise.all
    // Dispatch SET_DATA with results
    // Handle errors with SET_ERROR
  };

  useEffect(() => {
    fetchData();
  }, [boardId]);

  // TODO: Implement action functions
  const addTask = async (taskInput: Omit<Task, 'id' | 'createdAt'>) => {
    // Call api.createTask()
    // Dispatch ADD_TASK with result
    // Handle errors
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    // Call api.updateTask()
    // Dispatch UPDATE_TASK with result
  };

  const deleteTask = async (id: string) => {
    // Call api.deleteTask()
    // Dispatch DELETE_TASK with id
  };

  const moveTask = async (taskId: string, toColumnId: string) => {
    // TODO: Implement optimistic update
    // 1. Save current state
    // 2. Update UI immediately (dispatch MOVE_TASK)
    // 3. Call API
    // 4. On error, rollback (dispatch MOVE_TASK back to original)
  };

  return (
    <BoardContext.Provider
      value={{ state, addTask, updateTask, deleteTask, moveTask, refresh: fetchData }}
    >
      {children}
    </BoardContext.Provider>
  );
}
```

### 4. Add Loading and Error States to Board

Update `src/components/Board.tsx`:

```tsx
export function Board() {
  const { state } = useBoard();

  // TODO: Show loading spinner if state.isLoading
  // HINT: Use a centered spinner component

  // TODO: Show error message if state.error
  // Include a retry button that calls refresh()

  // TODO: Render board if data loaded successfully

  return (
    // ... rest of board rendering
  );
}
```

### 5. Add Environment Variable

Create `.env`:

```
REACT_APP_API_URL=http://localhost:3001/api
```

### 6. Test the Integration

1. Start the backend: `cd server && npm run dev`
2. Start the frontend: `npm run dev`
3. Verify tasks load from API
4. Create a new task and refresh - it should persist
5. Move a task and verify it saves

### 7. Submit Your PR

```bash
git add .
git commit -m "feat: connect frontend to REST API"
git push -u origin task-3.3-connect-api
```

## Acceptance Criteria

- [ ] API client module created with all endpoints
- [ ] Board fetches data on mount
- [ ] Loading spinner shown while fetching
- [ ] Error message shown on failure with retry
- [ ] Create task calls API and updates UI
- [ ] Update task calls API and updates UI
- [ ] Delete task calls API and updates UI
- [ ] Move task uses optimistic update

## Tips

- Use optimistic updates for better UX (update UI before API response)
- Always handle errors in async functions
- Add retry logic for failed requests
- Keep API client separate from React components

## Key Concepts

**Optimistic Update:** Update UI immediately, rollback if API fails
**Loading States:** Show spinners during async operations
**Error Boundaries:** Catch and display errors gracefully

---

**Previous Task:** [Task 3.2: Build REST API Endpoints](../task-3.2/INSTRUCTIONS.md)
**Next Task:** [Task 3.4: Add Error Handling](../task-3.4/INSTRUCTIONS.md)
