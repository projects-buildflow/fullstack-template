# Task 4.2: Build User Dashboard

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | AI Review |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [Recharts](https://recharts.org/) - Charting library

## Objective

Create a personal dashboard showing assigned tasks, recent activity, and task statistics.

## The Situation

> **Jamie Park (Designer):** "Users want to see their productivity at a glance - what tasks are assigned to them, what they've completed, and their progress over time. Build a dashboard that motivates and informs!"

## Requirements

Build a dashboard with:
- Tasks assigned to current user
- Task completion statistics
- Activity timeline
- Progress charts
- Quick actions

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-4.2-user-dashboard
```

### 2. Install Chart Library (Optional)

```bash
npm install recharts
# Or build custom charts with SVG
```

### 3. Create Dashboard Page

Create `src/pages/Dashboard.tsx`:

```tsx
import { useAuth } from '../context/AuthContext';
import { useBoard } from '../context/BoardContext';

export function DashboardPage() {
  const { user } = useAuth();
  const { state } = useBoard();

  // TODO: Get user's tasks from state
  // Filter tasks where assignee_id matches user.id

  // TODO: Calculate statistics
  // - Total tasks assigned to user
  // - Completed tasks (in 'done' column)
  // - In progress tasks
  // - Overdue tasks (due_date < today and not done)
  // - Completion rate (completed / total * 100)

  // TODO: Render header with welcome message

  // TODO: Render stats grid (4 cards)
  // Use StatsCard component for each metric

  // TODO: Render main content area
  // Left: Tasks due soon, Weekly progress chart
  // Right: Completion rate circle, Recent activity, Quick actions
}
```

### 4. Create Stats Card Component

Create `src/components/StatsCard.tsx`:

```tsx
interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  // TODO: Render card with:
  // - Icon with colored background
  // - Title (small gray text)
  // - Value (large bold number)
  // Use Tailwind classes based on color prop
}
```

### 5. Create Progress Chart Component

Create `src/components/ProgressChart.tsx`:

```tsx
import { useMemo } from 'react';
import { Task } from '../types/task';

interface ProgressChartProps {
  tasks: Task[];
}

export function ProgressChart({ tasks }: ProgressChartProps) {
  // TODO: Calculate last 7 days of completions
  const chartData = useMemo(() => {
    // For each of last 7 days:
    // - Get date
    // - Count tasks completed on that date
    // - Return { day: 'Mon', completed: 3 }
  }, [tasks]);

  // TODO: Render bar chart
  // Use CSS to create bars with height based on value
  // Show day labels below each bar
}
```

### 6. Create Activity Feed Component

Create `src/components/ActivityFeed.tsx`:

```tsx
interface ActivityFeedProps {
  userId?: string;
  limit?: number;
}

export function ActivityFeed({ userId, limit = 10 }: ActivityFeedProps) {
  // TODO: In real app, fetch from activity API
  // For now, show placeholder activities

  // TODO: Render list of activities with:
  // - Icon for action type (complete, create, move)
  // - Task name
  // - Time ago
}
```

### 7. Add Completion Rate Circle

In your dashboard:

```tsx
// TODO: Render circular progress indicator
// Use SVG circle with strokeDasharray for progress
// Show percentage in center
// Formula: circumference = 2 * PI * radius
// Progress: (completionRate / 100) * circumference
```

### 8. Add Route

Add the dashboard route to your router:

```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

### 9. Submit for AI Review

```bash
git add .
git commit -m "feat: add user dashboard with stats and activity"
git push -u origin task-4.2-user-dashboard
```

## Acceptance Criteria

- [ ] Shows user's assigned tasks count
- [ ] Shows completed/in-progress/overdue counts
- [ ] Displays completion rate with visual indicator
- [ ] Shows tasks due soon (top 5)
- [ ] Weekly progress chart (last 7 days)
- [ ] Recent activity feed (placeholder)
- [ ] Quick action buttons
- [ ] Responsive layout (mobile and desktop)

## Tips

- Use meaningful stats that help users understand their progress
- Make the dashboard visually appealing with colors and icons
- Consider adding motivational messages for milestones
- Use grid layout for responsiveness

## Key Concepts

**Data Aggregation:** Calculate statistics from raw task data
**Data Visualization:** Present numbers in visual formats (charts, circles)
**Responsive Grid:** Use CSS Grid for flexible layouts

---

**Previous Task:** [Task 4.1: Add Search & Filter](../task-4.1/INSTRUCTIONS.md)
**Next Task:** [Task 4.3: Performance Optimization](../task-4.3/INSTRUCTIONS.md)
