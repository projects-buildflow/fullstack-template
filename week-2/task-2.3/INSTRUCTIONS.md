# Task 2.3: Build Edit Modal

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [React Hooks](https://react.dev/reference/react/hooks)

## Objective

Create an edit modal that pre-populates with task data and allows updating all task fields.

## The Situation

> **Sarah Johnson (Frontend Developer):** "Users need to edit tasks after creating them - update the title, change priority, add a description. Reuse the modal and form components from the add task feature, but pre-fill with existing data."

## Requirements

Build an EditTaskModal with:
- Pre-populated form fields from existing task
- All fields editable (title, description, priority)
- Save updates to state
- Option to delete task from edit modal

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-2.3-edit-modal
```

### 2. Create Edit Task Form

Create `src/components/EditTaskForm.tsx`:

```tsx
import { useState, FormEvent } from 'react';
import { Task, Priority } from '../types/task';
import { Button } from './Button';

interface EditTaskFormProps {
  task: Task;
  onSubmit: (task: Task) => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function EditTaskForm({ task, onSubmit, onDelete, onCancel }: EditTaskFormProps) {
  // TODO: Initialize state from task prop
  // const [title, setTitle] = useState(task.title);
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // TODO: Add validation function (similar to AddTaskForm)

  // TODO: Add handleSubmit that calls onSubmit with updated task

  // TODO: Render delete confirmation UI if showDeleteConfirm is true
  // Show task title and Cancel/Delete buttons

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TODO: Add same form fields as AddTaskForm */}
      {/* TODO: Add metadata display (created date) */}
      {/* TODO: Add Delete button on left, Cancel/Save on right */}
    </form>
  );
}
```

**Design Notes:**
- Pre-populate all fields from task prop
- Delete button: `variant="danger"` on left side
- Show created date as readonly metadata
- Delete confirmation: Simple dialog with task title quote

### 3. Create Edit Task Modal

Create `src/components/EditTaskModal.tsx`:

```tsx
import { Modal } from './Modal';
import { EditTaskForm } from './EditTaskForm';
import { useBoard } from '../context/BoardContext';
import { Task } from '../types/task';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const { updateTask, deleteTask } = useBoard();

  if (!task) return null;

  // TODO: Create handleSubmit that calls updateTask
  // TODO: Create handleDelete that calls deleteTask and closes modal

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <EditTaskForm
        task={task}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onCancel={onClose}
      />
    </Modal>
  );
}
```

### 4. Update TaskCard to Open Edit Modal

Update `src/components/TaskCard.tsx`:

```tsx
// Add state for edit modal
const [isEditModalOpen, setIsEditModalOpen] = useState(false);

// Update the card div to open modal on click
<div onClick={() => setIsEditModalOpen(true)}>
  {/* existing card content */}
</div>

// Add the modal at end of component
<EditTaskModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  task={task}
/>
```

**Alternative Approach:**
Lift modal state to Board component for better organization:

```tsx
// In Board component
const [editingTask, setEditingTask] = useState<Task | null>(null);

// Pass down
<TaskCard task={task} onClick={() => setEditingTask(task)} />

// One modal at board level
<EditTaskModal
  isOpen={editingTask !== null}
  onClose={() => setEditingTask(null)}
  task={editingTask}
/>
```

### 5. Test the Feature

1. Click on any task card
2. Verify form is pre-populated
3. Edit fields and save
4. Verify changes persist
5. Test delete with confirmation

### 6. Submit Your PR

```bash
git add .
git commit -m "feat: add edit task modal with delete functionality"
git push -u origin task-2.3-edit-modal
```

## Acceptance Criteria

- [ ] Clicking task card opens edit modal
- [ ] Form pre-populates with existing task data
- [ ] Changes save correctly to state
- [ ] Delete shows confirmation dialog
- [ ] Delete removes task from board
- [ ] Modal closes on cancel/save/delete

## Tips

- Reuse the Modal component from Task 2.2
- Keep delete confirmation simple
- Show created date as metadata
- Consider lifting modal state to parent for better UX

---

**Previous Task:** [Task 2.2: Implement Add Task Feature](../task-2.2/INSTRUCTIONS.md)
**Next Task:** [Task 2.4: Implement Delete with Confirmation](../task-2.4/INSTRUCTIONS.md)
