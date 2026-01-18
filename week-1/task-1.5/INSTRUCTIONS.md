# Task 1.5: Build Column Component

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- [Discord #ask-sarah](https://discord.com/channels/taskmaster/ask-sarah) - Get help
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
      {/* Column Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* Color Indicator */}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />

          {/* Title */}
          <h2 className="font-semibold text-gray-900 flex-1">
            {column.title}
          </h2>

          {/* Task Count */}
          <span className="px-2 py-0.5 text-sm font-medium text-gray-600 bg-gray-200 rounded-full">
            {taskCount}
          </span>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {children}
      </div>

      {/* Add Task Button */}
      {onAddTask && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onAddTask}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Task
          </button>
        </div>
      )}
    </div>
  );
}
```

### 4. Create the Board Layout

Create `src/components/Board.tsx`:

```tsx
import { ReactNode } from 'react';

interface BoardProps {
  children: ReactNode;
}

export function Board({ children }: BoardProps) {
  return (
    <div className="flex gap-6 overflow-x-auto p-6 min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
```

### 5. Demo the Kanban Board

Update `src/pages/Components.tsx` or create `src/pages/BoardDemo.tsx`:

```tsx
import { Board } from '../components/Board';
import { Column } from '../components/Column';
import { TaskCard } from '../components/TaskCard';
import { Column as ColumnType, Task } from '../types/task';

const sampleColumns: ColumnType[] = [
  { id: 'todo', title: 'To Do', color: '#6366f1', taskIds: ['1', '2'] },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b', taskIds: ['3'] },
  { id: 'done', title: 'Done', color: '#22c55e', taskIds: ['4', '5'] },
];

const sampleTasks: Record<string, Task> = {
  '1': {
    id: '1',
    title: 'Set up project repository',
    description: 'Initialize the Git repo with proper structure',
    priority: 'high',
    columnId: 'todo',
    createdAt: '2024-02-01',
  },
  '2': {
    id: '2',
    title: 'Design database schema',
    priority: 'medium',
    columnId: 'todo',
    createdAt: '2024-02-01',
  },
  '3': {
    id: '3',
    title: 'Implement user authentication',
    description: 'Add login/register with JWT',
    priority: 'high',
    assignee: { id: '1', name: 'Jordan' },
    columnId: 'in-progress',
    createdAt: '2024-02-01',
  },
  '4': {
    id: '4',
    title: 'Create component library',
    priority: 'low',
    columnId: 'done',
    createdAt: '2024-02-01',
  },
  '5': {
    id: '5',
    title: 'Write API documentation',
    priority: 'low',
    columnId: 'done',
    createdAt: '2024-02-01',
  },
};

export function BoardDemo() {
  return (
    <Board>
      {sampleColumns.map((column) => (
        <Column
          key={column.id}
          column={column}
          taskCount={column.taskIds.length}
          onAddTask={() => console.log('Add task to', column.title)}
        >
          {column.taskIds.map((taskId) => (
            <TaskCard
              key={taskId}
              task={sampleTasks[taskId]}
              onClick={() => console.log('Clicked task', taskId)}
            />
          ))}
        </Column>
      ))}
    </Board>
  );
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

---

**Previous Task:** [Task 1.4: Create Task Card Component](../task-1.4/INSTRUCTIONS.md)
**Next Task:** [Task 1.6: Component Architecture Review](../task-1.6/INSTRUCTIONS.md)
