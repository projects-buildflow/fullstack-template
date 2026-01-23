# Task 2.1: Setup State Management

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [React Context Guide](https://react.dev/learn/passing-data-deeply-with-context)

## Objective

Implement state management for the Kanban board using React Context.

## The Situation

> **Alex Chen (Tech Lead):** "Our components look great, but they're static. We need state management so users can actually interact with the board. Let's use React Context - it's simple and built into React. We'll handle task creation, updates, and deletion."

## Requirements

Create a BoardContext that provides:
- Board state (columns and tasks)
- Actions: addTask, updateTask, deleteTask, moveTask
- Type-safe context with TypeScript

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-2.1-state-management
```

### 2. Create the Board Context

Create `src/context/BoardContext.tsx`:

```tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, Column } from '../types/task';

// State shape
interface BoardState {
  columns: Column[];
  tasks: Record<string, Task>;
}

// Action types
type BoardAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; fromColumnId: string; toColumnId: string } };

// Initial state
const initialState: BoardState = {
  columns: [
    { id: 'todo', title: 'To Do', color: '#6366f1', taskIds: [] },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b', taskIds: [] },
    { id: 'done', title: 'Done', color: '#22c55e', taskIds: [] },
  ],
  tasks: {},
};

// Reducer
function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'ADD_TASK': {
      // TODO: Add task to tasks object
      // TODO: Add task.id to correct column's taskIds array
      // Hint: Find column by task.columnId
      // Hint: Return new state object (immutably)
    }

    case 'UPDATE_TASK': {
      // TODO: Update task in tasks object
      // Hint: Spread existing task and override with new data
    }

    case 'DELETE_TASK': {
      // TODO: Remove task from tasks object
      // TODO: Remove task.id from column's taskIds
      // Hint: Use object destructuring to remove key
      // Hint: Use filter() to remove from taskIds array
    }

    case 'MOVE_TASK': {
      // TODO: Update task's columnId
      // TODO: Remove from old column's taskIds
      // TODO: Add to new column's taskIds
    }

    default:
      return state;
  }
}

// Context
interface BoardContextValue {
  state: BoardState;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
}

const BoardContext = createContext<BoardContextValue | null>(null);

// Provider
export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // TODO: Create action functions that call dispatch
  // Example: const addTask = (task: Task) => dispatch({ type: 'ADD_TASK', payload: task });

  return (
    <BoardContext.Provider value={{ state, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </BoardContext.Provider>
  );
}

// Hook
export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}
```

### 3. Wrap Your App with the Provider

Update your main App component:

```tsx
import { BoardProvider } from './context/BoardContext';

function App() {
  return (
    <BoardProvider>
      {/* Your app content */}
    </BoardProvider>
  );
}
```

### 4. Update Board Component to Use Context

Update `src/components/Board.tsx`:

```tsx
import { useBoard } from '../context/BoardContext';
import { Column } from './Column';
import { TaskCard } from './TaskCard';

export function Board() {
  const { state } = useBoard();

  return (
    <div className="flex gap-6 overflow-x-auto p-6 min-h-screen bg-gray-50">
      {/* TODO: Map over state.columns */}
      {/* TODO: For each column, render Column component */}
      {/* TODO: For each column.taskIds, render TaskCard with state.tasks[taskId] */}
    </div>
  );
}
```

### 5. Test State Management

Add some test tasks in your initial state or create a simple form to test adding tasks.

### 6. Submit Your PR

```bash
git add .
git commit -m "feat: add BoardContext for state management"
git push -u origin task-2.1-state-management
```

## Acceptance Criteria

- [ ] BoardContext created with TypeScript types
- [ ] Reducer handles ADD_TASK, UPDATE_TASK, DELETE_TASK, MOVE_TASK
- [ ] BoardProvider wraps the app
- [ ] useBoard hook throws error if used outside provider
- [ ] Board component reads from context
- [ ] State updates immutably

## Bonus Challenges

1. Add localStorage persistence
2. Implement undo/redo functionality
3. Add optimistic updates pattern

## Tips

- Always spread state to create new objects (immutability)
- Keep action types in a union for type safety
- Consider using immer for complex state updates
- Test each action type independently

## Common Issues

**Issue:** "Cannot read property of undefined"
**Fix:** Ensure reducer returns a new state object for every case

**Issue:** State not updating
**Fix:** Check that you're spreading state and not mutating directly

---

**Previous Task:** [Task 1.6: Component Architecture Review](../../week-1/task-1.6/INSTRUCTIONS.md)
**Next Task:** [Task 2.2: Implement Add Task Feature](../task-2.2/INSTRUCTIONS.md)
