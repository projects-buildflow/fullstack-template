# Task 2.3: Build Edit Modal

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- [Discord #ask-sarah](https://discord.com/channels/taskmaster/ask-sarah) - Get help
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
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const validate = () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...task,
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
    });
  };

  if (showDeleteConfirm) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this task?
        </p>
        <p className="text-sm text-gray-500 mb-6">
          &quot;{task.title}&quot;
        </p>
        <div className="flex justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete Task
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          autoFocus
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <div className="flex gap-3">
          {(['low', 'medium', 'high'] as Priority[]).map((p) => (
            <label
              key={p}
              className={`flex-1 text-center py-2 px-3 border rounded-md cursor-pointer transition-colors ${
                priority === p
                  ? p === 'low'
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : p === 'medium'
                    ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                    : 'bg-red-100 border-red-500 text-red-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="priority"
                value={p}
                checked={priority === p}
                onChange={() => setPriority(p)}
                className="sr-only"
              />
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500 pt-2 border-t">
        Created: {new Date(task.createdAt).toLocaleString()}
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="danger"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete
        </Button>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
```

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

  const handleSubmit = (updatedTask: Task) => {
    updateTask(updatedTask);
    onClose();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

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

// Update the card to open modal on click
<div onClick={() => setIsEditModalOpen(true)}>
  {/* existing card content */}
</div>

// Add the modal
<EditTaskModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  task={task}
/>
```

### 5. Alternative: Use a Shared Modal State

For better organization, create a shared modal context or lift state up:

```tsx
// In Board component or BoardContext
const [editingTask, setEditingTask] = useState<Task | null>(null);

// Pass down the setter
<TaskCard
  task={task}
  onClick={() => setEditingTask(task)}
/>

// One modal at the board level
<EditTaskModal
  isOpen={editingTask !== null}
  onClose={() => setEditingTask(null)}
  task={editingTask}
/>
```

### 6. Test the Feature

1. Click on any task card
2. Verify form is pre-populated
3. Edit fields and save
4. Verify changes persist
5. Test delete with confirmation

### 7. Submit Your PR

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

---

**Previous Task:** [Task 2.2: Implement Add Task Feature](../task-2.2/INSTRUCTIONS.md)
**Next Task:** [Task 2.4: Implement Delete with Confirmation](../task-2.4/INSTRUCTIONS.md)
