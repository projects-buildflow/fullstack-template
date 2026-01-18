# Task 2.4: Implement Delete with Confirmation

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 45 min | Pull Request |

## Quick Links

- [Discord #ask-marcus](https://discord.com/channels/taskmaster/ask-marcus) - Get help
- [Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## Objective

Add delete functionality with a confirmation dialog to prevent accidental deletions.

## The Situation

> **Marcus Williams (Backend Engineer):** "I've seen too many bug reports about accidental deletions. We need a confirmation step before permanently removing tasks. Also, add a quick-delete option with Ctrl/Cmd+Backspace for power users who know what they're doing."

## Requirements

Create a deletion system with:
- Confirmation dialog before delete
- Clear warning message
- Cancel and Confirm buttons
- Keyboard shortcut for power users
- Accessible dialog implementation

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-2.4-delete-confirmation
```

### 2. Create Confirmation Dialog Component

Create `src/components/ConfirmDialog.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button (safer default)
      confirmButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
        {/* Icon */}
        <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
          variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
        }`}>
          <svg
            className={`w-6 h-6 ${variant === 'danger' ? 'text-red-600' : 'text-yellow-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2
          id="dialog-title"
          className="text-lg font-semibold text-center text-gray-900 mb-2"
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="dialog-description"
          className="text-gray-600 text-center mb-6"
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            ref={confirmButtonRef}
            variant={variant}
            className="flex-1"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 3. Create useDeleteTask Hook

Create `src/hooks/useDeleteTask.ts`:

```tsx
import { useState, useCallback } from 'react';
import { Task } from '../types/task';
import { useBoard } from '../context/BoardContext';

export function useDeleteTask() {
  const { deleteTask } = useBoard();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const requestDelete = useCallback((task: Task) => {
    setTaskToDelete(task);
  }, []);

  const confirmDelete = useCallback(() => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  }, [taskToDelete, deleteTask]);

  const cancelDelete = useCallback(() => {
    setTaskToDelete(null);
  }, []);

  return {
    taskToDelete,
    requestDelete,
    confirmDelete,
    cancelDelete,
    isDeleteDialogOpen: taskToDelete !== null,
  };
}
```

### 4. Add Delete Button to Task Card

Update `src/components/TaskCard.tsx`:

```tsx
import { MouseEvent } from 'react';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
}

export function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onDelete?.();
  };

  return (
    <div onClick={onClick} className="relative group">
      {/* Card content... */}

      {/* Delete button - shows on hover */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}
```

### 5. Integrate in Board Component

Update your Board component:

```tsx
import { ConfirmDialog } from './ConfirmDialog';
import { useDeleteTask } from '../hooks/useDeleteTask';

export function Board() {
  const { state } = useBoard();
  const {
    taskToDelete,
    requestDelete,
    confirmDelete,
    cancelDelete,
    isDeleteDialogOpen,
  } = useDeleteTask();

  return (
    <>
      <div className="flex gap-6 overflow-x-auto p-6">
        {state.columns.map((column) => (
          <Column key={column.id} column={column} taskCount={column.taskIds.length}>
            {column.taskIds.map((taskId) => (
              <TaskCard
                key={taskId}
                task={state.tasks[taskId]}
                onDelete={() => requestDelete(state.tasks[taskId])}
              />
            ))}
          </Column>
        ))}
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep Task"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
```

### 6. Add Keyboard Shortcut (Bonus)

Add to TaskCard when selected:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Backspace') {
      onDelete?.();
    }
  };

  if (isSelected) {
    document.addEventListener('keydown', handleKeyDown);
  }

  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isSelected, onDelete]);
```

### 7. Test the Feature

1. Hover over a task card - delete button appears
2. Click delete - confirmation dialog opens
3. Click Cancel - dialog closes, task remains
4. Click Delete - task is removed
5. Test keyboard: Escape closes dialog

### 8. Submit Your PR

```bash
git add .
git commit -m "feat: add delete confirmation dialog"
git push -u origin task-2.4-delete-confirmation
```

## Acceptance Criteria

- [ ] Delete button appears on task card hover
- [ ] Clicking delete opens confirmation dialog
- [ ] Dialog shows task title in message
- [ ] Cancel closes dialog without deleting
- [ ] Confirm deletes task and closes dialog
- [ ] Escape key closes dialog
- [ ] Dialog is accessible (ARIA attributes)

## Bonus Challenges

1. Add keyboard shortcut (Cmd/Ctrl+Backspace)
2. Add undo functionality after delete
3. Add batch delete for multiple tasks

## Tips

- Use `role="alertdialog"` for accessibility
- Stop event propagation on delete button
- Show task title in confirmation message

---

**Previous Task:** [Task 2.3: Build Edit Modal](../task-2.3/INSTRUCTIONS.md)
**Next Task:** [Task 2.5: Add Drag and Drop](../task-2.5/INSTRUCTIONS.md)
