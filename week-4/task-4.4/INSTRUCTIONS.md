# Task 4.4: Responsive Design

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 60 min | Pull Request |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
- [Tailwind Responsive](https://tailwindcss.com/docs/responsive-design)

## Objective

Make the Kanban board fully responsive and usable on mobile devices.

## The Situation

> **Marcus Williams (Backend Engineer):** "Our users want to check their tasks on the go! The board needs to work on phones and tablets. Consider touch interactions, screen space, and mobile-first patterns."

## Requirements

Make the app responsive:
- Mobile-first approach
- Collapsible sidebar on mobile
- Horizontal scroll for board on small screens
- Touch-friendly interactions
- Proper spacing and sizing

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-4.4-responsive
```

### 2. Create Responsive Navigation

Create `src/components/MobileNav.tsx`:

```tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Board', icon: '📋' },
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 px-4 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### 3. Update Board for Mobile

Update `src/components/Board.tsx`:

```tsx
export function Board() {
  const { state } = useBoard();

  return (
    <div className="h-screen flex flex-col">
      {/* Header - hidden on mobile (use MobileNav instead) */}
      <header className="hidden md:flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">My Board</h1>
        {/* Desktop nav */}
      </header>

      {/* Board - horizontal scroll on all sizes */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-4 min-w-max h-full">
          {state.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              taskCount={column.taskIds.length}
              className="w-72 md:w-80 flex-shrink-0"
            >
              {/* Tasks */}
            </Column>
          ))}
        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
```

### 4. Make Column Component Responsive

Update `src/components/Column.tsx`:

```tsx
export function Column({ column, taskCount, children, className = '' }: ColumnProps) {
  return (
    <div
      className={`
        flex flex-col bg-gray-100 rounded-lg
        max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-6rem)]
        ${className}
      `}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="font-semibold text-gray-900 flex-1 truncate">
            {column.title}
          </h2>
          <span className="px-2 py-0.5 text-sm font-medium text-gray-600 bg-gray-200 rounded-full">
            {taskCount}
          </span>
        </div>
      </div>

      {/* Scrollable task list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {children}
      </div>

      {/* Add button - touch friendly */}
      <button className="m-3 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2 touch-manipulation">
        <span>+</span>
        <span>Add Task</span>
      </button>
    </div>
  );
}
```

### 5. Make TaskCard Touch-Friendly

Update `src/components/TaskCard.tsx`:

```tsx
export function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        bg-white rounded-lg shadow-sm border border-gray-200 p-4
        cursor-pointer hover:shadow-md transition-shadow
        touch-manipulation
        active:scale-[0.98] active:shadow-none
      "
    >
      {/* Priority Badge - larger tap target */}
      <div className="flex items-center justify-between mb-2">
        <PriorityBadge priority={task.priority} />
        {task.due_date && (
          <span className="text-xs text-gray-500 px-2 py-1">
            {formatDate(task.due_date)}
          </span>
        )}
      </div>

      {/* Title - readable on mobile */}
      <h3 className="font-medium text-gray-900 mb-1 text-sm md:text-base">
        {task.title}
      </h3>

      {/* Description - show less on mobile */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-1 md:line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {task.assignee && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
              {task.assignee.name.charAt(0)}
            </div>
            <span className="text-xs text-gray-600 hidden sm:inline">
              {task.assignee.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 6. Create Mobile-Friendly Modal

Update `src/components/Modal.tsx`:

```tsx
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal - bottom sheet on mobile, centered on desktop */}
      <div className="
        relative bg-white w-full
        md:w-full md:max-w-md md:mx-4 md:rounded-lg
        rounded-t-2xl md:rounded-lg
        max-h-[90vh] overflow-y-auto
        animate-slide-up md:animate-fade-in
      ">
        {/* Handle for mobile bottom sheet */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 -m-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 pb-8 md:pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### 7. Add Responsive Animations

Add to your global CSS:

```css
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
```

### 8. Test on Different Devices

Test your responsive design:
- Mobile (375px width)
- Tablet (768px width)
- Desktop (1024px+ width)
- Test with Chrome DevTools device emulator

### 9. Submit Your PR

```bash
git add .
git commit -m "feat: add responsive design for mobile and tablet"
git push -u origin task-4.4-responsive
```

## Acceptance Criteria

- [ ] Board scrolls horizontally on mobile
- [ ] Mobile navigation at bottom
- [ ] Modals display as bottom sheets on mobile
- [ ] Touch targets are at least 44px
- [ ] Text is readable on small screens
- [ ] No horizontal overflow on mobile
- [ ] Works on iOS and Android

## Tips

- Use Tailwind's responsive prefixes: `md:`, `lg:`, etc.
- Test on real devices, not just DevTools
- Use `touch-manipulation` for better touch response

---

**Previous Task:** [Task 4.3: Performance Optimization](../task-4.3/INSTRUCTIONS.md)
**Next Task:** [Task 4.5: Deployment Setup](../task-4.5/INSTRUCTIONS.md)
