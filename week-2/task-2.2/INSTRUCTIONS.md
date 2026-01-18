# Task 2.2: Implement Add Task Feature

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- [Discord #ask-jamie](https://discord.com/channels/taskmaster/ask-jamie) - Get help
- [React Forms](https://react.dev/learn/reacting-to-input-with-state)

## Objective

Build the "Add Task" functionality with a modal form including title, description, and priority selection.

## The Situation

> **Jamie Park (Designer):** "Users need to add tasks quickly without disrupting their flow. Let's build a modal that pops up when they click 'Add Task' in any column. Keep it simple - title, description, and priority are the essentials."

## Requirements

Create an AddTaskModal with:
- Modal overlay with close functionality
- Form with title (required), description, and priority
- Submit creates task in the correct column
- Form validation and error messages
- Keyboard support (Escape to close, Enter to submit)

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-2.2-add-task
```

### 2. Create Modal Component

Create `src/components/Modal.tsx`:

```tsx
import { useEffect, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### 3. Create Add Task Form

Create `src/components/AddTaskForm.tsx`:

```tsx
import { useState, FormEvent } from 'react';
import { Priority } from '../types/task';
import { Button } from './Button';

interface AddTaskFormProps {
  columnId: string;
  onSubmit: (task: {
    title: string;
    description: string;
    priority: Priority;
    columnId: string;
  }) => void;
  onCancel: () => void;
}

export function AddTaskForm({ columnId, onSubmit, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [errors, setErrors] = useState<{ title?: string }>({});

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
      title: title.trim(),
      description: description.trim(),
      priority,
      columnId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter task title"
          autoFocus
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task description (optional)"
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

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Add Task
        </Button>
      </div>
    </form>
  );
}
```

### 4. Create AddTaskModal Component

Create `src/components/AddTaskModal.tsx`:

```tsx
import { Modal } from './Modal';
import { AddTaskForm } from './AddTaskForm';
import { useBoard } from '../context/BoardContext';
import { Priority } from '../types/task';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
}

export function AddTaskModal({ isOpen, onClose, columnId }: AddTaskModalProps) {
  const { addTask, state } = useBoard();
  const column = state.columns.find((c) => c.id === columnId);

  const handleSubmit = (taskData: {
    title: string;
    description: string;
    priority: Priority;
    columnId: string;
  }) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Task to ${column?.title || 'Column'}`}
    >
      <AddTaskForm
        columnId={columnId}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
```

### 5. Integrate with Column Component

Update `src/components/Column.tsx` to use the modal:

```tsx
import { useState } from 'react';
import { AddTaskModal } from './AddTaskModal';

// In your Column component:
const [isAddModalOpen, setIsAddModalOpen] = useState(false);

// Add the button and modal:
<button onClick={() => setIsAddModalOpen(true)}>Add Task</button>

<AddTaskModal
  isOpen={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  columnId={column.id}
/>
```

### 6. Test the Feature

1. Click "Add Task" on any column
2. Fill out the form
3. Submit and verify task appears in correct column
4. Test validation (submit with empty title)
5. Test Escape key to close modal

### 7. Submit Your PR

```bash
git add .
git commit -m "feat: add task creation with modal form"
git push -u origin task-2.2-add-task
```

## Acceptance Criteria

- [ ] Modal opens when clicking "Add Task"
- [ ] Form has title, description, and priority fields
- [ ] Title is required with validation error
- [ ] Priority selection shows visual feedback
- [ ] Modal closes on backdrop click or Escape
- [ ] Task is added to correct column on submit
- [ ] Form resets after successful submission

## Tips

- Use `autoFocus` on the title input for better UX
- Prevent body scroll when modal is open
- Generate unique IDs with `Date.now()` (for now)

---

**Previous Task:** [Task 2.1: Setup State Management](../task-2.1/INSTRUCTIONS.md)
**Next Task:** [Task 2.3: Build Edit Modal](../task-2.3/INSTRUCTIONS.md)
