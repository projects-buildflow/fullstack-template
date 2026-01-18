# Week 2: State & Interactivity

**Total XP: 400 | Tasks: 6**

Week 2 adds interactivity to your Kanban board with state management, CRUD operations, and drag-and-drop functionality.

## Overview

| Task | Title | XP | Time | Type |
|------|-------|----|----|------|
| 2.1 | Setup State Management | 75 | 60 min | PR |
| 2.2 | Implement Add Task Feature | 75 | 60 min | PR |
| 2.3 | Build Edit Modal | 75 | 60 min | PR |
| 2.4 | Implement Delete with Confirmation | 50 | 45 min | PR |
| 2.5 | Add Drag and Drop | 100 | 90 min | PR |
| 2.6 | Keyboard Accessibility | 25 | 30 min | PR |

## Learning Objectives

By the end of Week 2, you will:

- Implement React Context for state management
- Build forms with validation
- Create modal dialogs
- Add drag-and-drop functionality
- Make your app accessible

## Key Concepts

### State Management
- React Context API
- useReducer pattern
- Actions and reducers
- Immutable state updates

### Forms
- Controlled inputs
- Form validation
- Error handling
- Form state management

### Drag and Drop
- dnd-kit library
- Draggable items
- Droppable zones
- Drag events

### Accessibility
- Keyboard navigation
- ARIA attributes
- Focus management
- Screen reader support

## Components Built

```
src/
├── components/
│   ├── Modal.tsx              # Reusable modal dialog
│   ├── AddTaskModal.tsx       # Task creation form
│   ├── EditTaskModal.tsx      # Task editing form
│   ├── ConfirmDialog.tsx      # Confirmation dialog
│   ├── DraggableTaskCard.tsx  # Draggable task wrapper
│   └── DroppableColumn.tsx    # Droppable column wrapper
├── context/
│   └── BoardContext.tsx       # Board state management
└── hooks/
    ├── useKeyboardNavigation.ts
    └── useDeleteTask.ts
```

## Getting Started

1. [Task 2.1: Setup State Management](../week-2/task-2.1/INSTRUCTIONS.md)

Good luck with Week 2!
