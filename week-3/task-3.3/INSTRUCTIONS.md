# Task 3.3: Connect Frontend to API

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- [Discord #ask-sarah](https://discord.com/channels/taskmaster/ask-sarah) - Get help
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
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, error.error?.message || error.message);
  }

  return response.json();
}

export const api = {
  // Tasks
  getTasks: (columnId?: string) =>
    fetchApi<{ tasks: Task[] }>(
      columnId ? `/tasks?column_id=${columnId}` : '/tasks'
    ),

  getTask: (id: string) =>
    fetchApi<{ task: Task }>(`/tasks/${id}`),

  createTask: (task: CreateTaskInput) =>
    fetchApi<{ task: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  updateTask: (id: string, updates: Partial<Task>) =>
    fetchApi<{ task: Task }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteTask: (id: string) =>
    fetchApi<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  moveTask: (id: string, columnId: string, position?: number) =>
    fetchApi<{ task: Task }>(`/tasks/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ column_id: columnId, position }),
    }),

  // Columns
  getColumns: (boardId: string) =>
    fetchApi<{ columns: Column[] }>(`/columns?board_id=${boardId}`),

  // Boards
  getBoard: (id: string) =>
    fetchApi<{ board: Board }>(`/boards/${id}`),
};

// Types
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
import { Task, Column } from '../types/task';

interface BoardState {
  columns: Column[];
  tasks: Record<string, Task>;
  isLoading: boolean;
  error: string | null;
}

type BoardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: { columns: Column[]; tasks: Task[] } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; toColumnId: string } };

const initialState: BoardState = {
  columns: [],
  tasks: {},
  isLoading: true,
  error: null,
};

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_DATA': {
      const { columns, tasks } = action.payload;
      const taskRecord = tasks.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
      }, {} as Record<string, Task>);

      return {
        ...state,
        columns: columns.map((col) => ({
          ...col,
          taskIds: tasks.filter((t) => t.column_id === col.id).map((t) => t.id),
        })),
        tasks: taskRecord,
        isLoading: false,
        error: null,
      };
    }

    case 'ADD_TASK': {
      const task = action.payload;
      return {
        ...state,
        tasks: { ...state.tasks, [task.id]: task },
        columns: state.columns.map((col) =>
          col.id === task.column_id
            ? { ...col, taskIds: [...col.taskIds, task.id] }
            : col
        ),
      };
    }

    // ... other cases similar to before
    default:
      return state;
  }
}

interface BoardContextValue {
  state: BoardState;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, toColumnId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ boardId, children }: { boardId: string; children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // Fetch initial data
  const fetchData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [columnsRes, tasksRes] = await Promise.all([
        api.getColumns(boardId),
        api.getTasks(),
      ]);
      dispatch({
        type: 'SET_DATA',
        payload: { columns: columnsRes.columns, tasks: tasksRes.tasks },
      });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof ApiError ? err.message : 'Failed to load board',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [boardId]);

  // Actions that call API
  const addTask = async (taskInput: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const { task } = await api.createTask({
        column_id: taskInput.columnId,
        title: taskInput.title,
        description: taskInput.description,
        priority: taskInput.priority,
      });
      dispatch({ type: 'ADD_TASK', payload: task });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create task' });
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { task } = await api.updateTask(id, updates);
      dispatch({ type: 'UPDATE_TASK', payload: task });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
      throw err;
    }
  };

  const moveTask = async (taskId: string, toColumnId: string) => {
    // Optimistic update
    const task = state.tasks[taskId];
    const fromColumnId = task.column_id;
    dispatch({ type: 'MOVE_TASK', payload: { taskId, toColumnId } });

    try {
      await api.moveTask(taskId, toColumnId);
    } catch (err) {
      // Rollback on failure
      dispatch({ type: 'MOVE_TASK', payload: { taskId, toColumnId: fromColumnId } });
      throw err;
    }
  };

  return (
    <BoardContext.Provider
      value={{ state, addTask, updateTask, deleteTask, moveTask, refresh: fetchData }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}
```

### 4. Add Loading and Error States to Board

Update `src/components/Board.tsx`:

```tsx
export function Board() {
  const { state } = useBoard();

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

- [ ] API client module created
- [ ] Board fetches data on mount
- [ ] Loading spinner shown while fetching
- [ ] Error message shown on failure
- [ ] Create task calls API and updates UI
- [ ] Update task calls API and updates UI
- [ ] Delete task calls API and updates UI
- [ ] Move task uses optimistic update

## Tips

- Use optimistic updates for better UX
- Always handle errors in async functions
- Add retry logic for failed requests

---

**Previous Task:** [Task 3.2: Build REST API Endpoints](../task-3.2/INSTRUCTIONS.md)
**Next Task:** [Task 3.4: Add Error Handling](../task-3.4/INSTRUCTIONS.md)
