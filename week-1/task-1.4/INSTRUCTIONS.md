# Task 1.4: Create Task Card Component

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- [Discord #ask-alex](https://discord.com/channels/taskmaster/ask-alex) - Get help
- [React Component Patterns](https://react.dev/learn)

## Objective

Build the TaskCard component that displays task title, description, priority badge, and assignee avatar.

## The Situation

> **Jamie Park (Designer):** "The task card is the heart of our Kanban board. Users need to quickly see what a task is about, who's working on it, and how urgent it is. Make it clean, informative, and visually distinct based on priority."

## Requirements

The TaskCard should display:
- Task title
- Task description (truncated if long)
- Priority badge (low, medium, high)
- Assignee avatar and name
- Due date (optional)
- Tags (optional)

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-1.4-task-card
```

### 2. Define Task Types

Create `src/types/task.ts`:

```typescript
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  dueDate?: string;
  tags?: string[];
  columnId: string;
  createdAt: string;
}
```

### 3. Create Priority Badge Component

Create `src/components/PriorityBadge.tsx`:

```tsx
import { Priority } from '../types/task';

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: {
    label: 'Low',
    className: 'bg-green-100 text-green-800',
  },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-800',
  },
  high: {
    label: 'High',
    className: 'bg-red-100 text-red-800',
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}
```

### 4. Create the TaskCard Component

Create `src/components/TaskCard.tsx`:

```tsx
import { Task } from '../types/task';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { title, description, priority, assignee, dueDate, tags } = task;

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-2">
        <PriorityBadge priority={priority} />
        {dueDate && (
          <span className="text-xs text-gray-500">
            {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Assignee */}
      {assignee && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          {assignee.avatarUrl ? (
            <img
              src={assignee.avatarUrl}
              alt={assignee.name}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
              {assignee.name.charAt(0)}
            </div>
          )}
          <span className="text-sm text-gray-700">{assignee.name}</span>
        </div>
      )}
    </div>
  );
}
```

### 5. Add to Components Demo Page

Update `src/pages/Components.tsx`:

```tsx
import { TaskCard } from '../components/TaskCard';
import { Task } from '../types/task';

const sampleTask: Task = {
  id: '1',
  title: 'Design homepage mockup',
  description: 'Create initial wireframes and high-fidelity mockups for the new homepage design.',
  priority: 'high',
  assignee: {
    id: 'user-1',
    name: 'Sarah Johnson',
    avatarUrl: 'https://github.com/github.png',
  },
  dueDate: '2024-02-15',
  tags: ['design', 'frontend'],
  columnId: 'in-progress',
  createdAt: '2024-02-01',
};

// In your component:
<section>
  <h2 className="text-xl font-semibold mb-4">Task Card</h2>
  <div className="max-w-sm">
    <TaskCard task={sampleTask} onClick={() => console.log('Card clicked')} />
  </div>
</section>
```

### 6. Test Your Component

1. Navigate to http://localhost:3000/components
2. Verify the task card displays all information correctly
3. Test hover effect
4. Check priority badge colors for all priorities

### 7. Submit Your PR

```bash
git add .
git commit -m "feat: add TaskCard component with priority badge"
git push -u origin task-1.4-task-card
```

## Acceptance Criteria

- [ ] TaskCard displays title, description, and priority
- [ ] PriorityBadge shows correct colors for low/medium/high
- [ ] Assignee avatar shows with fallback to initials
- [ ] Description is truncated after 2 lines (line-clamp-2)
- [ ] Due date is formatted nicely
- [ ] Tags display as small badges
- [ ] Card has hover effect
- [ ] Proper TypeScript types defined

## Bonus Challenges

1. Add a "more actions" menu (edit, delete)
2. Show time remaining until due date
3. Add task completion checkbox

## Tips

- Use Tailwind's `line-clamp` for text truncation
- Consider using `date-fns` for date formatting
- Keep the card compact - it will be in a list

---

**Previous Task:** [Task 1.3: Build a Button Component](../task-1.3/INSTRUCTIONS.md)
**Next Task:** [Task 1.5: Build Column Component](../task-1.5/INSTRUCTIONS.md)
