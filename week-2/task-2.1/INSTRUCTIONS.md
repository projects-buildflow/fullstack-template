# Task 2.1: Setup State Management

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- [Discord #ask-alex](https://discord.com/channels/taskmaster/ask-alex) - Get help
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
      const task = action.payload;
      const column = state.columns.find((c) => c.id === task.columnId);
      if (!column) return state;

      return {
        ...state,
        tasks: { ...state.tasks, [task.id]: task },
        columns: state.columns.map((c) =>
          c.id === task.columnId
            ? { ...c, taskIds: [...c.taskIds, task.id] }
            : c
        ),
      };
    }

    case 'UPDATE_TASK': {
      const task = action.payload;
      return {
        ...state,
        tasks: { ...state.tasks, [task.id]: task },
      };
    }

    case 'DELETE_TASK': {
      const taskId = action.payload;
      const task = state.tasks[taskId];
      if (!task) return state;

      const { [taskId]: removed, ...remainingTasks } = state.tasks;

      return {
        ...state,
        tasks: remainingTasks,
        columns: state.columns.map((c) =>
          c.id === task.columnId
            ? { ...c, taskIds: c.taskIds.filter((id) => id !== taskId) }
            : c
        ),
      };
    }

    case 'MOVE_TASK': {
      const { taskId, fromColumnId, toColumnId } = action.payload;
      if (fromColumnId === toColumnId) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...state.tasks[taskId], columnId: toColumnId },
        },
        columns: state.columns.map((c) => {
          if (c.id === fromColumnId) {
            return { ...c, taskIds: c.taskIds.filter((id) => id !== taskId) };
          }
          if (c.id === toColumnId) {
            return { ...c, taskIds: [...c.taskIds, taskId] };
          }
          return c;
        }),
      };
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

  const addTask = (task: Task) => dispatch({ type: 'ADD_TASK', payload: task });
  const updateTask = (task: Task) => dispatch({ type: 'UPDATE_TASK', payload: task });
  const deleteTask = (taskId: string) => dispatch({ type: 'DELETE_TASK', payload: taskId });
  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string) =>
    dispatch({ type: 'MOVE_TASK', payload: { taskId, fromColumnId, toColumnId } });

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
      {state.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          taskCount={column.taskIds.length}
        >
          {column.taskIds.map((taskId) => (
            <TaskCard
              key={taskId}
              task={state.tasks[taskId]}
            />
          ))}
        </Column>
      ))}
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

---

**Previous Task:** [Task 1.6: Component Architecture Review](../../week-1/task-1.6/INSTRUCTIONS.md)
**Next Task:** [Task 2.2: Implement Add Task Feature](../task-2.2/INSTRUCTIONS.md)
