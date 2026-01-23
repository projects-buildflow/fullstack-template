# Task 2.4: Implement Delete with Confirmation

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 45 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
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
- Keyboard shortcut for power users (bonus)
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
  // TODO: Add useEffect for Escape key handling

  // TODO: Focus management (focus cancel button by default for safety)

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="alertdialog">
      {/* TODO: Add backdrop */}
      {/* TODO: Add dialog box with warning icon */}
      {/* TODO: Add title (h2 with id for aria-labelledby) */}
      {/* TODO: Add message (p with id for aria-describedby) */}
      {/* TODO: Add Cancel and Confirm buttons */}
    </div>
  );
}
```

**Design Spec:**
- Warning icon: Circle with exclamation mark (red for danger, yellow for warning)
- Layout: Centered dialog, icon above text
- Buttons: Cancel (secondary) and Confirm (danger/warning variant)
- ARIA attributes: `role="alertdialog"`, `aria-labelledby`, `aria-describedby`

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
    // TODO: Call deleteTask with taskToDelete.id
    // TODO: Clear taskToDelete
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
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"
          title="Delete task"
        >
          {/* TODO: Add trash icon SVG */}
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
  const { taskToDelete, requestDelete, confirmDelete, cancelDelete, isDeleteDialogOpen } = useDeleteTask();

  return (
    <>
      <div className="flex gap-6 overflow-x-auto p-6">
        {/* Render columns and tasks with onDelete={requestDelete} */}
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

### 6. Test the Feature

1. Hover over a task card - delete button appears
2. Click delete - confirmation dialog opens
3. Click Cancel - dialog closes, task remains
4. Click Delete - task is removed
5. Test keyboard: Escape closes dialog

### 7. Submit Your PR

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
- Focus Cancel button by default (safer)

---

**Previous Task:** [Task 2.3: Build Edit Modal](../task-2.3/INSTRUCTIONS.md)
**Next Task:** [Task 2.5: Add Drag and Drop](../task-2.5/INSTRUCTIONS.md)
