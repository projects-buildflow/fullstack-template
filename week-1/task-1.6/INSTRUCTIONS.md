# Task 1.6: Component Architecture Review

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 25 XP | 30 min | Pull Request |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
- [React Component Patterns](https://react.dev/learn/thinking-in-react)

## Objective

Document your component architecture decisions and create a simple component diagram.

## The Situation

> **Alex Chen (Tech Lead):** "Before we move to Week 2 where we add interactivity, let's document what we've built. Good documentation helps new team members understand the codebase and helps us maintain consistency as the project grows."

## Requirements

Create documentation that includes:
- Component hierarchy diagram
- Prop interfaces for each component
- Design decisions and trade-offs
- Component usage examples

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-1.6-architecture-docs
```

### 2. Create Architecture Documentation

Create `docs/COMPONENT-ARCHITECTURE.md`:

```markdown
# TaskMaster Component Architecture

## Overview

This document describes the component architecture for the TaskMaster Kanban board application.

## Component Hierarchy

```
App
├── Header
│   ├── Logo
│   └── UserMenu
├── Board
│   └── Column (multiple)
│       ├── ColumnHeader
│       │   └── PriorityBadge
│       ├── TaskCard (multiple)
│       │   ├── PriorityBadge
│       │   └── AssigneeAvatar
│       └── AddTaskButton
└── Footer
```

## Core Components

### Board
**Purpose:** Container for the Kanban board layout
**Location:** `src/components/Board.tsx`

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Column components |

**Design Decisions:**
- Uses flexbox with horizontal scroll for column layout
- Columns have fixed width to maintain visual consistency
- Background is subtle gray to make columns stand out

---

### Column
**Purpose:** Holds tasks in a specific status
**Location:** `src/components/Column.tsx`

| Prop | Type | Description |
|------|------|-------------|
| column | ColumnType | Column data (id, title, color) |
| taskCount | number | Number of tasks in column |
| onAddTask | () => void | Callback when add button clicked |
| children | ReactNode | TaskCard components |

**Design Decisions:**
- Fixed width (320px) for consistent layout
- Max height with scroll for many tasks
- Color indicator for visual distinction

---

### TaskCard
**Purpose:** Displays individual task information
**Location:** `src/components/TaskCard.tsx`

| Prop | Type | Description |
|------|------|-------------|
| task | Task | Task data object |
| onClick | () => void | Callback when card clicked |

**Design Decisions:**
- Compact design to show many tasks
- Priority badge for quick scanning
- Description truncated to 2 lines
- Hover effect for interactivity

---

### PriorityBadge
**Purpose:** Visual indicator of task priority
**Location:** `src/components/PriorityBadge.tsx`

| Prop | Type | Description |
|------|------|-------------|
| priority | Priority | 'low' \| 'medium' \| 'high' |

**Design Decisions:**
- Color-coded: green (low), yellow (medium), red (high)
- Pill shape for visual distinction
- Small size to not dominate card

---

### Button
**Purpose:** Reusable button with variants
**Location:** `src/components/Button.tsx`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | ButtonVariant | 'primary' | Visual style |
| size | ButtonSize | 'md' | Button size |
| isLoading | boolean | false | Show loading spinner |
| disabled | boolean | false | Disable interaction |

**Design Decisions:**
- Three variants for different contexts
- Loading state prevents double-clicks
- Extends native button attributes

---

## Type Definitions

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  assignee?: Assignee;
  dueDate?: string;
  tags?: string[];
  columnId: string;
  createdAt: string;
}
```

### Column
```typescript
interface Column {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
}
```

---

## Architecture Principles

1. **Single Responsibility:** Each component does one thing well
2. **Composition:** Complex UIs built from simple components
3. **Type Safety:** All props have TypeScript interfaces
4. **Accessibility:** Semantic HTML, keyboard support
5. **Consistency:** Tailwind utility classes for styling

## Future Considerations

- [ ] Add drag-and-drop between columns
- [ ] Implement task editing modal
- [ ] Add column reordering
- [ ] Connect to backend API
```

### 3. Create a Visual Diagram

Create a simple diagram (can be ASCII or use a tool like Excalidraw/Figma).

Save as `docs/component-diagram.png` or include ASCII in the markdown:

```
┌─────────────────────────────────────────────────────────────┐
│                          App                                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │                      Header                          │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                       Board                          │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐             │    │
│  │  │ Column  │  │ Column  │  │ Column  │             │    │
│  │  │         │  │         │  │         │             │    │
│  │  │┌───────┐│  │┌───────┐│  │┌───────┐│             │    │
│  │  ││TaskCrd││  ││TaskCrd││  ││TaskCrd││             │    │
│  │  │└───────┘│  │└───────┘│  │└───────┘│             │    │
│  │  │┌───────┐│  │┌───────┐│  │         │             │    │
│  │  ││TaskCrd││  ││TaskCrd││  │         │             │    │
│  │  │└───────┘│  │└───────┘│  │         │             │    │
│  │  │[+Add]   │  │[+Add]   │  │[+Add]   │             │    │
│  │  └─────────┘  └─────────┘  └─────────┘             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 4. Submit Your PR

```bash
git add .
git commit -m "docs: add component architecture documentation"
git push -u origin task-1.6-architecture-docs
```

Create a PR with:
- Title: `Task 1.6: Component Architecture Documentation`
- Summary of what you documented

## Acceptance Criteria

- [ ] Created COMPONENT-ARCHITECTURE.md
- [ ] Documented all core components with props
- [ ] Included component hierarchy
- [ ] Explained design decisions
- [ ] Added type definitions
- [ ] Included visual diagram (ASCII or image)

## Tips

- Focus on documenting decisions, not just code
- Keep docs concise - they should be quick to read
- Include "why" not just "what"

---

**Previous Task:** [Task 1.5: Build Column Component](../task-1.5/INSTRUCTIONS.md)
**Next Task:** [Task 2.1: Setup State Management](../../week-2/task-2.1/INSTRUCTIONS.md)

---

## Week 1 Complete!

Congratulations on finishing Week 1! You've built the foundation of a Kanban board:

- Environment setup and dev workflow
- Reusable UI components
- Task cards and columns
- Documentation

Next week, you'll add interactivity with state management, CRUD operations, and drag-and-drop!
