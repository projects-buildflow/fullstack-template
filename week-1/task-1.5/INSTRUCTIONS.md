# Task 1.5: Build Column Component

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## Objective

Create the Column component that holds multiple TaskCards and displays the column header with task count.

## The Situation

> **Alex Chen (Tech Lead):** "Now that we have task cards, we need columns to organize them. A Kanban board typically has columns like 'To Do', 'In Progress', and 'Done'. Each column should have a header showing the name and task count, and a scrollable area for cards."

## Requirements

Build a Column component with:
- Column header with name and color indicator
- Task count badge
- Scrollable task list area
- "Add task" button at the bottom
- Visual distinction between columns

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-1.5-column-component
```

### 2. Define Column Types

Update `src/types/task.ts`:

```typescript
export interface Column {
  id: string;
  title: string;
  color: string; // Hex color for the header accent
  taskIds: string[];
}

export interface Board {
  columns: Column[];
  tasks: Record<string, Task>;
}
```

### 3. Create the Column Component

Create `src/components/Column.tsx`:

```tsx
import { ReactNode } from 'react';
import { Column as ColumnType } from '../types/task';

interface ColumnProps {
  column: ColumnType;
  taskCount: number;
  onAddTask?: () => void;
  children: ReactNode;
}

export function Column({ column, taskCount, onAddTask, children }: ColumnProps) {
  return (
    <div className="flex flex-col bg-gray-100 rounded-lg w-80 max-h-[calc(100vh-12rem)]">
      {/* TODO: Add column header with color indicator and task count */}
      {/* Hint: Use flexbox with gap-2 for layout */}
      {/* Hint: Color indicator should be w-3 h-3 rounded-full */}

      {/* TODO: Add scrollable task list */}
      {/* Hint: Use flex-1 overflow-y-auto for scroll area */}
      {/* Hint: Space tasks with space-y-3 */}

      {/* TODO: Add "Add Task" button */}
      {/* Hint: Only render if onAddTask prop is provided */}
      {/* Hint: Include a plus icon SVG or text */}
    </div>
  );
}
```

**Design Spec:**
- Header: `p-3 border-b` with flex layout
- Color dot: `w-3 h-3 rounded-full` with `style={{ backgroundColor: column.color }}`
- Count badge: `px-2 py-0.5 text-sm bg-gray-200 rounded-full`
- Task area: `flex-1 overflow-y-auto p-3`
- Button: `w-full py-2 hover:bg-gray-200 rounded-md`

### 4. Create the Board Layout

Create `src/components/Board.tsx`:

```tsx
import { ReactNode } from 'react';

interface BoardProps {
  children: ReactNode;
}

export function Board({ children }: BoardProps) {
  // TODO: Return a container with horizontal scroll
  // Hint: Use flex gap-6 overflow-x-auto
  // Hint: Add p-6 for padding and min-h-screen for height
  // Hint: Background should be bg-gray-50
}
```

### 5. Demo the Kanban Board

Update `src/pages/Components.tsx` or create `src/pages/BoardDemo.tsx`:

```tsx
import { Board } from '../components/Board';
import { Column } from '../components/Column';
import { TaskCard } from '../components/TaskCard';
import { Column as ColumnType, Task } from '../types/task';

// TODO: Create sample columns array with 3 columns
// Example: { id: 'todo', title: 'To Do', color: '#6366f1', taskIds: ['1', '2'] }

// TODO: Create sample tasks object (Record<string, Task>)
// Use tasks from previous demos

export function BoardDemo() {
  // TODO: Map over columns and render Column components
  // TODO: For each column, map over taskIds and render TaskCards
  // Hint: Use nested .map() calls
}
```

### 6. Test Your Component

1. Navigate to the board demo page
2. Verify columns display with headers and colors
3. Check task count updates correctly
4. Test scrolling when many tasks are in a column
5. Verify "Add Task" button appears and is clickable

### 7. Submit Your PR

```bash
git add .
git commit -m "feat: add Column and Board components for Kanban layout"
git push -u origin task-1.5-column-component
```

## Acceptance Criteria

- [ ] Column displays title with color indicator
- [ ] Task count badge shows correct number
- [ ] Column has scrollable area for tasks
- [ ] "Add Task" button is present and styled
- [ ] Board layout allows horizontal scrolling
- [ ] Columns have fixed width (320px/w-80)
- [ ] Column height is constrained to viewport

## Bonus Challenges

1. Add column drag handle for reordering
2. Add "collapse column" functionality
3. Implement column menu (rename, delete, change color)

## Tips

- Use `max-h-[calc(100vh-12rem)]` to constrain column height
- `overflow-x-auto` on Board enables horizontal scrolling
- Fixed width columns look better on Kanban boards
- Check previous TaskCard implementation for styling consistency

## Common Issues

**Issue:** Columns not scrolling horizontally
**Fix:** Ensure Board has `overflow-x-auto` and columns have fixed width

**Issue:** Task list not scrolling
**Fix:** Parent needs `max-h-[...]` and task area needs `overflow-y-auto`

---

**Previous Task:** [Task 1.4: Create Task Card Component](../task-1.4/INSTRUCTIONS.md)
**Next Task:** [Task 1.6: Component Architecture Review](../task-1.6/INSTRUCTIONS.md)
