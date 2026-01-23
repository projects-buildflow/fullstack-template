# Task 2.2: Implement Add Task Feature

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
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
  // TODO: Add useEffect to handle Escape key
  // TODO: Prevent body scroll when modal is open
  // Hint: document.body.style.overflow = 'hidden'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* TODO: Add backdrop that closes on click */}
      {/* Hint: Use absolute inset-0 bg-black/50 */}

      {/* TODO: Add modal container */}
      {/* Hint: relative bg-white rounded-lg max-w-md */}

      {/* TODO: Add header with title and close button */}
      {/* TODO: Add content area for children */}
    </div>
  );
}
```

**Design Spec:**
- Backdrop: `absolute inset-0 bg-black/50` with onClick={onClose}
- Modal: `relative bg-white rounded-lg shadow-xl w-full max-w-md`
- Header: `flex items-center justify-between p-4 border-b`
- Close button: X icon with hover effect

### 3. Create Add Task Form

Create `src/components/AddTaskForm.tsx`:

```tsx
import { useState, FormEvent } from 'react';
import { Priority } from '../types/task';
import { Button } from './Button';

interface AddTaskFormProps {
  columnId: string;
  onSubmit: (task: { title: string; description: string; priority: Priority; columnId: string }) => void;
  onCancel: () => void;
}

export function AddTaskForm({ columnId, onSubmit, onCancel }: AddTaskFormProps) {
  // TODO: Add state for title, description, priority, errors
  // Hint: const [title, setTitle] = useState('');

  // TODO: Create validate function
  // Check if title is not empty

  // TODO: Create handleSubmit function
  // Prevent default, validate, call onSubmit

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TODO: Add title input field */}
      {/* Hint: Show error if errors.title exists */}

      {/* TODO: Add description textarea */}

      {/* TODO: Add priority radio buttons (low, medium, high) */}
      {/* Hint: Map over array of priorities */}

      {/* TODO: Add Cancel and Submit buttons */}
    </form>
  );
}
```

**Form Fields:**
- Title: Required, text input with error state
- Description: Optional textarea, 3 rows
- Priority: Radio buttons styled as pills (green/yellow/red)
- Buttons: Cancel (secondary) and Add Task (primary)

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

  // TODO: Find column title for modal heading

  // TODO: Create handleSubmit that generates task ID and calls addTask
  // Hint: Use `task-${Date.now()}` for ID
  // Hint: Add createdAt: new Date().toISOString()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Task to ${/* column title */}`}>
      <AddTaskForm columnId={columnId} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
```

### 5. Integrate with Column Component

Update `src/components/Column.tsx`:

```tsx
import { useState } from 'react';
import { AddTaskModal } from './AddTaskModal';

// In your Column component:
const [isAddModalOpen, setIsAddModalOpen] = useState(false);

// Update Add Task button:
<button onClick={() => setIsAddModalOpen(true)}>Add Task</button>

// Add modal at end of component:
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
- Test keyboard navigation through form fields

---

**Previous Task:** [Task 2.1: Setup State Management](../task-2.1/INSTRUCTIONS.md)
**Next Task:** [Task 2.3: Build Edit Modal](../task-2.3/INSTRUCTIONS.md)
