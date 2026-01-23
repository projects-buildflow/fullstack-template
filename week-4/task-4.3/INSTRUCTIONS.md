# Task 4.3: Performance Optimization

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 60 min | Pull Request |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
- [React Profiler](https://react.dev/reference/react/Profiler)

## Objective

Optimize app performance: implement lazy loading, memoization, and reduce unnecessary re-renders.

## The Situation

> **Alex Chen (Tech Lead):** "Performance matters! As our board grows with hundreds of tasks, the app needs to stay snappy. Let's identify bottlenecks and optimize. Use React DevTools Profiler to measure improvements."

## Requirements

Optimize performance:
- Implement React.lazy for code splitting
- Memoize expensive computations
- Prevent unnecessary re-renders
- Virtualize long task lists
- Optimize images and assets

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-4.3-performance
```

### 2. Add Code Splitting with React.lazy

Update `src/App.tsx`:

```tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load pages
const BoardPage = lazy(() => import('./pages/Board'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const SettingsPage = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<BoardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 3. Memoize TaskCard Component

Update `src/components/TaskCard.tsx`:

```tsx
import { memo } from 'react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
}

export const TaskCard = memo(function TaskCard({
  task,
  onClick,
  onDelete,
}: TaskCardProps) {
  // Component implementation...
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if task data changed
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.task.column_id === nextProps.task.column_id
  );
});
```

### 4. Memoize Expensive Calculations

Use `useMemo` for filtered/sorted data:

```tsx
import { useMemo } from 'react';

function Board() {
  const { state } = useBoard();

  // Memoize task grouping by column
  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    state.columns.forEach((col) => {
      grouped[col.id] = col.taskIds
        .map((id) => state.tasks[id])
        .filter(Boolean);
    });
    return grouped;
  }, [state.columns, state.tasks]);

  // Memoize sorted tasks within each column
  const sortedTasksByColumn = useMemo(() => {
    const sorted: Record<string, Task[]> = {};
    Object.entries(tasksByColumn).forEach(([colId, tasks]) => {
      sorted[colId] = [...tasks].sort((a, b) => a.position - b.position);
    });
    return sorted;
  }, [tasksByColumn]);

  return (/* ... */);
}
```

### 5. Stabilize Callbacks with useCallback

```tsx
import { useCallback } from 'react';

function Board() {
  const { deleteTask, updateTask } = useBoard();

  // Stabilize callbacks to prevent child re-renders
  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
  }, [deleteTask]);

  const handleUpdateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
  }, [updateTask]);

  return (
    <Column>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={() => handleDeleteTask(task.id)}
        />
      ))}
    </Column>
  );
}
```

### 6. Add Virtual List for Large Lists

Install virtualization library:

```bash
npm install @tanstack/react-virtual
```

Create `src/components/VirtualTaskList.tsx`:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface VirtualTaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function VirtualTaskList({ tasks, onTaskClick }: VirtualTaskListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated task card height
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <TaskCard
              task={tasks[virtualItem.index]}
              onClick={() => onTaskClick(tasks[virtualItem.index])}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 7. Debounce User Input

Create `src/hooks/useDebounce.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### 8. Measure Performance

Add React Profiler to identify slow components:

```tsx
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: string,
  actualDuration: number,
) {
  if (actualDuration > 16) { // Longer than one frame
    console.log(`Slow render: ${id} took ${actualDuration}ms`);
  }
}

<Profiler id="Board" onRender={onRenderCallback}>
  <Board />
</Profiler>
```

### 9. Submit Your PR

```bash
git add .
git commit -m "perf: add code splitting, memoization, and virtualization"
git push -u origin task-4.3-performance
```

## Acceptance Criteria

- [ ] Pages are lazy loaded with React.lazy
- [ ] TaskCard uses React.memo
- [ ] Expensive computations use useMemo
- [ ] Callbacks are stabilized with useCallback
- [ ] Virtual list for columns with many tasks
- [ ] Search input is debounced
- [ ] No console warnings about unnecessary re-renders

## Bonus Challenges

1. Add React DevTools Profiler measurements to PR
2. Implement image lazy loading
3. Add service worker for caching

## Tips

- Profile first, optimize second - don't guess at bottlenecks
- Be careful with memo - wrong dependencies can cause bugs
- Virtual lists are only needed for 100+ items

---

**Previous Task:** [Task 4.2: Build User Dashboard](../task-4.2/INSTRUCTIONS.md)
**Next Task:** [Task 4.4: Responsive Design](../task-4.4/INSTRUCTIONS.md)
