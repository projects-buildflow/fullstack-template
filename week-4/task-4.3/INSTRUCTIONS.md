# Task 4.3: Performance Optimization

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
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

// TODO: Lazy load pages
// const BoardPage = lazy(() => import('./pages/Board'));
// const DashboardPage = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={/* TODO: Loading spinner */}>
      <Routes>
        {/* TODO: Use lazy-loaded components */}
      </Routes>
    </Suspense>
  );
}
```

### 3. Memoize TaskCard Component

Update `src/components/TaskCard.tsx`:

```tsx
import { memo } from 'react';

// TODO: Wrap component with memo()
export const TaskCard = memo(function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
  // Component implementation...
}, (prevProps, nextProps) => {
  // TODO: Custom comparison function
  // Return true if props are equal (skip re-render)
  // Compare: task.id, title, description, priority, column_id
});
```

### 4. Memoize Expensive Calculations

```tsx
import { useMemo } from 'react';

function Board() {
  const { state } = useBoard();

  // TODO: Memoize task grouping by column
  const tasksByColumn = useMemo(() => {
    // Group tasks by column_id
    // Return Record<string, Task[]>
  }, [state.columns, state.tasks]);

  // TODO: Memoize sorted tasks within each column
  const sortedTasksByColumn = useMemo(() => {
    // Sort tasks by position within each column
  }, [tasksByColumn]);
}
```

### 5. Stabilize Callbacks with useCallback

```tsx
import { useCallback } from 'react';

function Board() {
  const { deleteTask, updateTask } = useBoard();

  // TODO: Wrap callbacks with useCallback
  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
  }, [deleteTask]);

  const handleUpdateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
  }, [updateTask]);

  // TODO: Use stable callbacks in child components
}
```

### 6. Add Virtual List (Optional)

Install virtualization library:

```bash
npm install @tanstack/react-virtual
```

Create `src/components/VirtualTaskList.tsx`:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function VirtualTaskList({ tasks, onTaskClick }: VirtualTaskListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // TODO: Set up virtualizer
  // estimateSize: 120px per task
  // overscan: 5 items

  // TODO: Render only visible items
  // Use position: absolute with transform for positioning
}
```

### 7. Debounce User Input

Create `src/hooks/useDebounce.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  // TODO: Return debounced value
  // Use setTimeout to delay updates
  // Clear timeout on cleanup
}
```

### 8. Measure Performance (Optional)

Add React Profiler:

```tsx
import { Profiler } from 'react';

function onRenderCallback(id: string, phase: string, actualDuration: number) {
  // TODO: Log slow renders (> 16ms)
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
- [ ] TaskCard uses React.memo with custom comparison
- [ ] Expensive computations use useMemo
- [ ] Callbacks are stabilized with useCallback
- [ ] Search input is debounced (300ms)
- [ ] No console warnings about unnecessary re-renders

## Optimization Checklist

**Code Splitting:**
- [ ] Lazy load route components
- [ ] Show loading fallback

**Memoization:**
- [ ] Memo on TaskCard and other list items
- [ ] useMemo for filtered/sorted data
- [ ] useCallback for event handlers

**Input Handling:**
- [ ] Debounce search input
- [ ] Throttle scroll events (if any)

**Rendering:**
- [ ] Avoid inline object/function creation in render
- [ ] Use key prop correctly in lists

## Tips

- Profile first, optimize second - don't guess at bottlenecks
- Be careful with memo - wrong dependencies can cause bugs
- Virtual lists are only needed for 100+ items
- Test performance with large datasets

## Key Concepts

**Code Splitting:** Load code only when needed
**Memoization:** Cache computed values to avoid recalculation
**Virtualization:** Render only visible items in long lists
**Debouncing:** Delay function execution until user stops

---

**Previous Task:** [Task 4.2: Build User Dashboard](../task-4.2/INSTRUCTIONS.md)
**Next Task:** [Task 4.4: Responsive Design](../task-4.4/INSTRUCTIONS.md)
