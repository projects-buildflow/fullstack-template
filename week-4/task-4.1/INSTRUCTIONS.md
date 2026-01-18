# Task 4.1: Add Search & Filter

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- [Discord #ask-sarah](https://discord.com/channels/taskmaster/ask-sarah) - Get help
- [Debounce Pattern](https://usehooks.com/useDebounce/)

## Objective

Implement search functionality and filters for task priority, assignee, and due date.

## The Situation

> **Jamie Park (Designer):** "As boards grow, finding specific tasks becomes harder. Users need to search by title and filter by priority, assignee, and due date. Make it fast and responsive!"

## Requirements

Implement search and filters:
- Text search on task title/description
- Filter by priority (low/medium/high)
- Filter by assignee
- Filter by due date range
- Combine multiple filters
- Debounced search input

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-4.1-search-filter
```

### 2. Create Search and Filter Bar

Create `src/components/SearchFilterBar.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Priority } from '../types/task';

interface Filters {
  search: string;
  priority: Priority | 'all';
  assigneeId: string | 'all';
  dueDateRange: 'all' | 'overdue' | 'today' | 'week' | 'month';
}

interface SearchFilterBarProps {
  onFiltersChange: (filters: Filters) => void;
  assignees: { id: string; name: string }[];
}

export function SearchFilterBar({ onFiltersChange, assignees }: SearchFilterBarProps) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    priority: 'all',
    assigneeId: 'all',
    dueDateRange: 'all',
  });

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    onFiltersChange({ ...filters, search: debouncedSearch });
  }, [debouncedSearch, filters.priority, filters.assigneeId, filters.dueDateRange]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      priority: 'all',
      assigneeId: 'all',
      dueDateRange: 'all',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.priority !== 'all' ||
    filters.assigneeId !== 'all' ||
    filters.dueDateRange !== 'all';

  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => updateFilter('priority', e.target.value as Priority | 'all')}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        {/* Assignee Filter */}
        <select
          value={filters.assigneeId}
          onChange={(e) => updateFilter('assigneeId', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Assignees</option>
          <option value="unassigned">Unassigned</option>
          {assignees.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Due Date Filter */}
        <select
          value={filters.dueDateRange}
          onChange={(e) => updateFilter('dueDateRange', e.target.value as Filters['dueDateRange'])}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due Today</option>
          <option value="week">Due This Week</option>
          <option value="month">Due This Month</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
```

### 3. Create Filter Logic Hook

Create `src/hooks/useFilteredTasks.ts`:

```typescript
import { useMemo } from 'react';
import { Task } from '../types/task';

interface Filters {
  search: string;
  priority: 'all' | 'low' | 'medium' | 'high';
  assigneeId: string | 'all';
  dueDateRange: 'all' | 'overdue' | 'today' | 'week' | 'month';
}

export function useFilteredTasks(tasks: Task[], filters: Filters): Task[] {
  return useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(searchLower) ||
          (task.description?.toLowerCase().includes(searchLower) ?? false);
        if (!matchesSearch) return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // Assignee filter
      if (filters.assigneeId !== 'all') {
        if (filters.assigneeId === 'unassigned' && task.assignee_id) {
          return false;
        }
        if (filters.assigneeId !== 'unassigned' && task.assignee_id !== filters.assigneeId) {
          return false;
        }
      }

      // Due date filter
      if (filters.dueDateRange !== 'all' && task.due_date) {
        const dueDate = new Date(task.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);

        const endOfMonth = new Date(today);
        endOfMonth.setMonth(today.getMonth() + 1);

        switch (filters.dueDateRange) {
          case 'overdue':
            if (dueDate >= today) return false;
            break;
          case 'today':
            if (dueDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'week':
            if (dueDate < today || dueDate > endOfWeek) return false;
            break;
          case 'month':
            if (dueDate < today || dueDate > endOfMonth) return false;
            break;
        }
      }

      return true;
    });
  }, [tasks, filters]);
}
```

### 4. Integrate with Board

Update `src/components/Board.tsx`:

```tsx
import { useState } from 'react';
import { SearchFilterBar } from './SearchFilterBar';
import { useFilteredTasks } from '../hooks/useFilteredTasks';

export function Board() {
  const { state } = useBoard();
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all' as const,
    assigneeId: 'all',
    dueDateRange: 'all' as const,
  });

  // Convert tasks object to array
  const allTasks = Object.values(state.tasks);
  const filteredTasks = useFilteredTasks(allTasks, filters);

  // Get unique assignees
  const assignees = useMemo(() => {
    const uniqueAssignees = new Map();
    allTasks.forEach((task) => {
      if (task.assignee_id && task.assignee_name) {
        uniqueAssignees.set(task.assignee_id, {
          id: task.assignee_id,
          name: task.assignee_name,
        });
      }
    });
    return Array.from(uniqueAssignees.values());
  }, [allTasks]);

  // Filter tasks by column
  const getColumnTasks = (columnId: string) =>
    filteredTasks.filter((task) => task.column_id === columnId);

  return (
    <div className="flex flex-col h-screen">
      <SearchFilterBar
        onFiltersChange={setFilters}
        assignees={assignees}
      />
      <div className="flex-1 flex gap-6 overflow-x-auto p-6">
        {state.columns.map((column) => {
          const columnTasks = getColumnTasks(column.id);
          return (
            <Column
              key={column.id}
              column={column}
              taskCount={columnTasks.length}
            >
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </Column>
          );
        })}
      </div>
    </div>
  );
}
```

### 5. Add Filter Results Indicator

Show how many tasks match the current filters:

```tsx
{hasActiveFilters && (
  <p className="text-sm text-gray-500 mt-2">
    Showing {filteredTasks.length} of {allTasks.length} tasks
  </p>
)}
```

### 6. Test Filters

1. Search for a task title
2. Filter by high priority
3. Combine search with priority filter
4. Filter by assignee
5. Filter by due date

### 7. Submit Your PR

```bash
git add .
git commit -m "feat: add search and filter functionality"
git push -u origin task-4.1-search-filter
```

## Acceptance Criteria

- [ ] Search filters tasks by title and description
- [ ] Priority filter works correctly
- [ ] Assignee filter includes "Unassigned" option
- [ ] Due date range filter works (overdue, today, week, month)
- [ ] Multiple filters combine correctly
- [ ] Search is debounced (300ms)
- [ ] Clear filters button resets all
- [ ] Shows filtered count

## Tips

- Use `useMemo` to avoid re-filtering on every render
- Debounce search to avoid too many filter operations
- Consider adding URL params for shareable filtered views

---

**Previous Task:** [Task 3.6: API Documentation](../../week-3/task-3.6/INSTRUCTIONS.md)
**Next Task:** [Task 4.2: Build User Dashboard](../task-4.2/INSTRUCTIONS.md)
