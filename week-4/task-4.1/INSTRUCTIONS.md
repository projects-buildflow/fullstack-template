# Task 4.1: Add Search & Filter

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
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

### 2. Create Filter Interface

Create `src/components/SearchFilterBar.tsx`:

```tsx
import { useState, useEffect } from 'react';

interface Filters {
  search: string;
  priority: 'all' | 'low' | 'medium' | 'high';
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

  // TODO: Implement debounce for search
  // Create debouncedSearch state
  // Use useEffect with setTimeout to delay search by 300ms

  // TODO: Call onFiltersChange when any filter changes

  // TODO: Render search input with icon
  // placeholder="Search tasks..."

  // TODO: Render priority dropdown
  // Options: All Priorities, High, Medium, Low

  // TODO: Render assignee dropdown
  // Options: All Assignees, Unassigned, then map over assignees

  // TODO: Render due date dropdown
  // Options: All Dates, Overdue, Due Today, Due This Week, Due This Month

  // TODO: Add "Clear Filters" button when filters active
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
      // TODO: Filter by search text
      // Check if title or description includes search (case-insensitive)

      // TODO: Filter by priority
      // Skip if priority is 'all'

      // TODO: Filter by assignee
      // Handle 'all' and 'unassigned' cases

      // TODO: Filter by due date range
      // Calculate date ranges for overdue, today, week, month
      // HINT: Use new Date() and comparison operators

      return true;
    });
  }, [tasks, filters]);
}
```

### 4. Integrate with Board

Update `src/components/Board.tsx`:

```tsx
import { useState, useMemo } from 'react';
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

  // TODO: Convert tasks object to array

  // TODO: Get filtered tasks with useFilteredTasks hook

  // TODO: Get unique assignees from tasks
  // Use Set or Map to deduplicate

  // TODO: Filter tasks by column
  const getColumnTasks = (columnId: string) => {
    // Return filtered tasks for this column
  };

  return (
    <div className="flex flex-col h-screen">
      <SearchFilterBar
        onFiltersChange={setFilters}
        assignees={assignees}
      />

      {/* TODO: Show filtered count if filters active */}

      <div className="flex-1 flex gap-6 overflow-x-auto p-6">
        {/* TODO: Render columns with filtered tasks */}
      </div>
    </div>
  );
}
```

### 5. Test Filters

1. Search for a task title
2. Filter by high priority
3. Combine search with priority filter
4. Filter by assignee
5. Filter by due date
6. Clear all filters

### 6. Submit Your PR

```bash
git add .
git commit -m "feat: add search and filter functionality"
git push -u origin task-4.1-search-filter
```

## Acceptance Criteria

- [ ] Search filters tasks by title and description (case-insensitive)
- [ ] Priority filter works correctly
- [ ] Assignee filter includes "Unassigned" option
- [ ] Due date range filter works (overdue, today, week, month)
- [ ] Multiple filters combine correctly (AND logic)
- [ ] Search is debounced (300ms delay)
- [ ] Clear filters button resets all
- [ ] Shows filtered count when active

## Tips

- Use `useMemo` to avoid re-filtering on every render
- Debounce search to avoid too many filter operations
- Combine filters with AND logic (all must match)
- Consider adding URL params for shareable filtered views

## Key Concepts

**Debouncing:** Delay function execution until user stops typing
**useMemo:** Cache expensive computations
**Filter Composition:** Combine multiple filters with AND logic

---

**Previous Task:** [Task 3.5: Implement User Authentication](../../week-3/task-3.5/INSTRUCTIONS.md)
**Next Task:** [Task 4.2: Build User Dashboard](../task-4.2/INSTRUCTIONS.md)
