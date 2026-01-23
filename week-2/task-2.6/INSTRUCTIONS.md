# Task 2.6: Keyboard Accessibility

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 25 XP | 30 min | Pull Request |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

## Objective

Add keyboard navigation support so users can manage tasks without a mouse.

## The Situation

> **Marcus Williams (Backend Engineer):** "Accessibility isn't optional. Many users prefer or need keyboard navigation. Let's add proper keyboard support so everyone can use our Kanban board effectively."

## Requirements

Implement keyboard navigation:
- Arrow keys to navigate between tasks
- Enter to select/edit a task
- Delete/Backspace to delete with confirmation
- Tab to move between columns
- Escape to cancel actions
- Visual focus indicators

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-2.6-keyboard-a11y
```

### 2. Create Keyboard Navigation Hook

Create `src/hooks/useKeyboardNavigation.ts`:

```tsx
import { useCallback, useState, useEffect } from 'react';

interface UseKeyboardNavigationProps {
  columns: { id: string; taskIds: string[] }[];
  onSelectTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function useKeyboardNavigation({
  columns,
  onSelectTask,
  onEditTask,
  onDeleteTask,
}: UseKeyboardNavigationProps) {
  const [focusedColumnIndex, setFocusedColumnIndex] = useState(0);
  const [focusedTaskIndex, setFocusedTaskIndex] = useState(0);

  const currentColumn = columns[focusedColumnIndex];
  const currentTaskId = currentColumn?.taskIds[focusedTaskIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedTaskIndex((prev) =>
            Math.max(0, prev - 1)
          );
          break;

        case 'ArrowDown':
          e.preventDefault();
          setFocusedTaskIndex((prev) =>
            Math.min((currentColumn?.taskIds.length || 1) - 1, prev + 1)
          );
          break;

        case 'ArrowLeft':
          e.preventDefault();
          setFocusedColumnIndex((prev) => Math.max(0, prev - 1));
          setFocusedTaskIndex(0);
          break;

        case 'ArrowRight':
          e.preventDefault();
          setFocusedColumnIndex((prev) =>
            Math.min(columns.length - 1, prev + 1)
          );
          setFocusedTaskIndex(0);
          break;

        case 'Enter':
          if (currentTaskId) {
            e.preventDefault();
            onEditTask(currentTaskId);
          }
          break;

        case 'Delete':
        case 'Backspace':
          if (currentTaskId && !e.target?.closest('input, textarea')) {
            e.preventDefault();
            onDeleteTask(currentTaskId);
          }
          break;

        case ' ':
          if (currentTaskId) {
            e.preventDefault();
            onSelectTask(currentTaskId);
          }
          break;
      }
    },
    [columns, currentColumn, currentTaskId, onSelectTask, onEditTask, onDeleteTask]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    focusedColumnIndex,
    focusedTaskIndex,
    focusedTaskId: currentTaskId,
    setFocusedTask: (columnIndex: number, taskIndex: number) => {
      setFocusedColumnIndex(columnIndex);
      setFocusedTaskIndex(taskIndex);
    },
  };
}
```

### 3. Add Focus Styles to TaskCard

Update `src/components/TaskCard.tsx`:

```tsx
interface TaskCardProps {
  task: Task;
  isFocused?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export function TaskCard({ task, isFocused, onClick, onDelete }: TaskCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer transition-all ${
        isFocused
          ? 'ring-2 ring-blue-500 border-blue-500'
          : 'border-gray-200 hover:shadow-md'
      }`}
      onClick={onClick}
      tabIndex={isFocused ? 0 : -1}
      role="button"
      aria-label={`Task: ${task.title}, Priority: ${task.priority}`}
    >
      {/* Card content... */}
    </div>
  );
}
```

### 4. Add ARIA Attributes to Board

Update `src/components/Board.tsx`:

```tsx
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

export function Board() {
  const { state, deleteTask } = useBoard();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    focusedColumnIndex,
    focusedTaskIndex,
    focusedTaskId,
  } = useKeyboardNavigation({
    columns: state.columns,
    onSelectTask: (taskId) => console.log('Selected:', taskId),
    onEditTask: (taskId) => setEditingTask(state.tasks[taskId]),
    onDeleteTask: (taskId) => {
      // Open delete confirmation
    },
  });

  return (
    <div
      role="application"
      aria-label="Kanban board"
      className="flex gap-6 overflow-x-auto p-6"
    >
      {state.columns.map((column, colIndex) => (
        <div
          key={column.id}
          role="region"
          aria-label={`${column.title} column, ${column.taskIds.length} tasks`}
        >
          <Column column={column} taskCount={column.taskIds.length}>
            {column.taskIds.map((taskId, taskIndex) => (
              <TaskCard
                key={taskId}
                task={state.tasks[taskId]}
                isFocused={
                  colIndex === focusedColumnIndex &&
                  taskIndex === focusedTaskIndex
                }
              />
            ))}
          </Column>
        </div>
      ))}
    </div>
  );
}
```

### 5. Add Skip Link

Add at the top of your app:

```tsx
<a
  href="#kanban-board"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
>
  Skip to Kanban board
</a>

{/* Later in the DOM */}
<main id="kanban-board">
  <Board />
</main>
```

### 6. Add Screen Reader Announcements

Create `src/components/Announcer.tsx`:

```tsx
import { useEffect, useState } from 'react';

interface AnnouncerProps {
  message: string;
}

export function Announcer({ message }: AnnouncerProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      const timer = setTimeout(() => setAnnouncement(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
```

### 7. Test Accessibility

1. Navigate using only keyboard
2. Test with screen reader (VoiceOver, NVDA)
3. Verify focus is visible at all times
4. Check all interactive elements are reachable

### 8. Submit Your PR

```bash
git add .
git commit -m "feat: add keyboard navigation and accessibility improvements"
git push -u origin task-2.6-keyboard-a11y
```

## Acceptance Criteria

- [ ] Arrow keys navigate between tasks and columns
- [ ] Enter opens edit modal for focused task
- [ ] Delete/Backspace triggers delete confirmation
- [ ] Visible focus indicator on focused task
- [ ] ARIA labels on columns and tasks
- [ ] Skip link to bypass navigation
- [ ] Screen reader announcements for actions

## Bonus Challenges

1. Add keyboard shortcuts legend (? to show)
2. Implement focus trapping in modals
3. Add high contrast mode support

## Tips

- Use `tabIndex` wisely - only focused item should be tabbable
- `aria-live="polite"` announces changes without interrupting
- Test with actual screen readers, not just dev tools

---

**Previous Task:** [Task 2.5: Add Drag and Drop](../task-2.5/INSTRUCTIONS.md)
**Next Task:** [Task 3.1: Design Database Schema](../../week-3/task-3.1/INSTRUCTIONS.md)

---

## Week 2 Complete!

Congratulations on finishing Week 2! Your Kanban board is now fully interactive:

- State management with React Context
- Add, edit, and delete tasks
- Drag and drop between columns
- Keyboard accessibility

Next week, you'll build the backend with a REST API and database!
