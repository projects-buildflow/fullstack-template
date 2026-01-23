# Task 4.2: Build User Dashboard

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | AI Review |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
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
```

### 3. Create Dashboard Page

Create `src/pages/Dashboard.tsx`:

```tsx
import { useAuth } from '../context/AuthContext';
import { useBoard } from '../context/BoardContext';
import { TaskCard } from '../components/TaskCard';
import { StatsCard } from '../components/StatsCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { ProgressChart } from '../components/ProgressChart';

export function DashboardPage() {
  const { user } = useAuth();
  const { state } = useBoard();

  // Get user's tasks
  const allTasks = Object.values(state.tasks);
  const myTasks = allTasks.filter((t) => t.assignee_id === user?.id);
  const completedTasks = myTasks.filter((t) => t.column_id === 'done');
  const inProgressTasks = myTasks.filter((t) => t.column_id === 'in-progress');
  const overdueTasks = myTasks.filter((t) => {
    if (!t.due_date) return false;
    return new Date(t.due_date) < new Date() && t.column_id !== 'done';
  });

  // Calculate stats
  const completionRate = myTasks.length > 0
    ? Math.round((completedTasks.length / myTasks.length) * 100)
    : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">
          Here's your productivity overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="My Tasks"
          value={myTasks.length}
          icon="📋"
          color="blue"
        />
        <StatsCard
          title="Completed"
          value={completedTasks.length}
          icon="✅"
          color="green"
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks.length}
          icon="🔄"
          color="yellow"
        />
        <StatsCard
          title="Overdue"
          value={overdueTasks.length}
          icon="⚠️"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - My Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tasks Due Soon */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tasks Due Soon</h2>
            {inProgressTasks.length === 0 ? (
              <p className="text-gray-500">No tasks in progress</p>
            ) : (
              <div className="space-y-3">
                {inProgressTasks.slice(0, 5).map((task) => (
                  <TaskCard key={task.id} task={task} compact />
                ))}
              </div>
            )}
          </section>

          {/* Progress Chart */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
            <ProgressChart tasks={myTasks} />
          </section>
        </div>

        {/* Right Column - Activity & Stats */}
        <div className="space-y-6">
          {/* Completion Rate */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Completion Rate</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#22c55e"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${completionRate * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                  {completionRate}%
                </span>
              </div>
              <div>
                <p className="text-gray-600">
                  {completedTasks.length} of {myTasks.length} tasks completed
                </p>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <ActivityFeed userId={user?.id} limit={5} />
          </section>

          {/* Quick Actions */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50">
                ➕ Create New Task
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50">
                📊 View All Boards
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50">
                ⚙️ Settings
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
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

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
};

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
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
  // Calculate last 7 days of completions
  const chartData = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const completed = tasks.filter((t) => {
        if (!t.completed_at) return false;
        return t.completed_at.split('T')[0] === dateStr;
      }).length;

      days.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        completed,
      });
    }

    return days;
  }, [tasks]);

  const maxValue = Math.max(...chartData.map((d) => d.completed), 5);

  return (
    <div className="h-48">
      <div className="flex items-end justify-between h-full gap-2">
        {chartData.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="flex-1 w-full flex items-end">
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{
                  height: `${(day.completed / maxValue) * 100}%`,
                  minHeight: day.completed > 0 ? '8px' : '0',
                }}
              />
            </div>
            <span className="text-xs text-gray-500 mt-2">{day.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
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
  // In real app, fetch from activity API
  const activities = [
    { id: '1', type: 'complete', task: 'Setup database', time: '2 hours ago' },
    { id: '2', type: 'create', task: 'Add filters', time: '5 hours ago' },
    { id: '3', type: 'move', task: 'Design mockups', time: '1 day ago' },
  ];

  const icons = {
    complete: '✅',
    create: '➕',
    move: '📦',
    comment: '💬',
  };

  return (
    <div className="space-y-3">
      {activities.slice(0, limit).map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <span className="text-lg">{icons[activity.type as keyof typeof icons]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{activity.task}</p>
            <p className="text-xs text-gray-400">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 7. Add Route

Add the dashboard route to your router:

```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

### 8. Submit for AI Review

```bash
git add .
git commit -m "feat: add user dashboard with stats and activity"
git push -u origin task-4.2-user-dashboard
```

## Acceptance Criteria

- [ ] Shows user's assigned tasks count
- [ ] Shows completed/in-progress/overdue counts
- [ ] Displays completion rate with visual indicator
- [ ] Shows tasks due soon
- [ ] Weekly progress chart
- [ ] Recent activity feed
- [ ] Quick action buttons
- [ ] Responsive layout

## Tips

- Use meaningful stats that help users understand their progress
- Make the dashboard visually appealing with colors and icons
- Consider adding motivational messages for milestones

---

**Previous Task:** [Task 4.1: Add Search & Filter](../task-4.1/INSTRUCTIONS.md)
**Next Task:** [Task 4.3: Performance Optimization](../task-4.3/INSTRUCTIONS.md)
