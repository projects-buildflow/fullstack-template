# Task 1.4: Create Task Card Component

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
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

### 3. Build Priority Badge Component

Create `src/components/PriorityBadge.tsx`:

**Requirements:**
- Accept `priority` prop (low | medium | high)
- Display colored badge with priority label
- Low = Green, Medium = Yellow, High = Red
- Small rounded pill shape

**Hint - Styling:**
- Use Record<Priority, config> pattern from Button task
- Badge classes: `px-2 py-1 text-xs font-medium rounded-full`
- Low: `bg-green-100 text-green-800`
- Medium: `bg-yellow-100 text-yellow-800`
- High: `bg-red-100 text-red-800`

### 4. Build TaskCard Component

Create `src/components/TaskCard.tsx`:

**Props interface:**
```tsx
interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}
```

**Layout structure (build this in JSX):**
```
┌─────────────────────────┐
│ [Priority]    [DueDate] │
│                         │
│ Task Title              │
│ Task description text   │
│ truncated at 2 lines... │
│                         │
│ [tag] [tag]             │
│ ──────────────────────  │
│ [Avatar] Assignee Name  │
└─────────────────────────┘
```

**Requirements:**
- White card with border and shadow
- Shows PriorityBadge component
- Display due date (formatted) if it exists
- Title in bold
- Description truncated to 2 lines (use Tailwind `line-clamp-2`)
- Tags as small gray pills
- Assignee with avatar or initials fallback
- Hover effect (increase shadow)
- Clickable (cursor-pointer)

**Tailwind hints:**
- Card: `bg-white rounded-lg shadow-sm border border-gray-200 p-4`
- Hover: `hover:shadow-md transition-shadow`
- Text truncation: `line-clamp-2`
- Avatar fallback: Use first character of name in a circle

**Destructure task props:**
```tsx
const { title, description, priority, assignee, dueDate, tags } = task;
```

### 5. Create Sample Data & Demo

Update `src/pages/Components.tsx`:

**Sample task object:**
```tsx
const sampleTask: Task = {
  id: '1',
  title: 'Design homepage mockup',
  description: 'Create initial wireframes and high-fidelity mockups...',
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
```

Display in a section with max-width constraint (cards should be ~320-384px wide).

**Test all variations:**
- Task with all fields
- Task with no description
- Task with no assignee
- Task with no tags
- Different priorities

### 6. Test Your Component

Navigate to http://localhost:3000/components and verify:
- Priority badges show correct colors
- Description truncates at 2 lines
- Due date formats correctly
- Avatar fallback shows initials when no avatarUrl
- Hover effect works
- onClick is called when card is clicked

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
