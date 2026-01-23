# Task 2.5: Add Drag and Drop

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 100 XP | 90 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [dnd-kit Documentation](https://dndkit.com/)

## Objective

Implement drag-and-drop functionality to move tasks between columns using dnd-kit.

## The Situation

> **Alex Chen (Tech Lead):** "The core feature of any Kanban board is drag-and-drop. Users expect to drag tasks between columns to update their status. We'll use dnd-kit - it's accessible, performant, and has great React integration."

## Requirements

Implement drag and drop with:
- Tasks can be dragged between columns
- Visual feedback during drag (shadow, placeholder)
- Column highlights when dragging over
- Tasks can be reordered within columns
- Touch device support

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-2.5-drag-drop
```

### 2. Install dnd-kit

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 3. Create Draggable Task Card

Create `src/components/DraggableTaskCard.tsx`:

```tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface DraggableTaskCardProps {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
}

export function DraggableTaskCard({ task, onClick, onDelete }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  // TODO: Create style object with transform and transition
  // Hint: Use CSS.Transform.toString(transform)
  // TODO: Set opacity to 0.5 when isDragging

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} onDelete={onDelete} />
    </div>
  );
}
```

### 4. Create Droppable Column

Create `src/components/DroppableColumn.tsx`:

```tsx
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType } from '../types/task';
import { ReactNode } from 'react';

interface DroppableColumnProps {
  column: ColumnType;
  taskIds: string[];
  children: ReactNode;
  onAddTask?: () => void;
}

export function DroppableColumn({ column, taskIds, children, onAddTask }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className={`flex flex-col bg-gray-100 rounded-lg w-80 ${isOver ? 'ring-2 ring-blue-500' : ''}`}>
      {/* TODO: Add column header (copy from Column component) */}

      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[100px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>

      {/* TODO: Add "Add Task" button */}
    </div>
  );
}
```

### 5. Update Board with DndContext

Update `src/components/Board.tsx`:

```tsx
import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useBoard } from '../context/BoardContext';
import { DroppableColumn } from './DroppableColumn';
import { DraggableTaskCard } from './DraggableTaskCard';
import { Task } from '../types/task';

export function Board() {
  const { state, moveTask } = useBoard();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 }, // 10px movement before drag starts
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    // TODO: Set activeTask from event.active.id
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // TODO: Clear activeTask
    // TODO: Find target column from event.over
    // TODO: Call moveTask if column changed
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto p-6 min-h-screen bg-gray-50">
        {/* TODO: Map columns and render DroppableColumn */}
        {/* TODO: Inside each column, map taskIds and render DraggableTaskCard */}
      </div>
    </DndContext>
  );
}
```

### 6. Test Drag and Drop

1. Start the dev server
2. Drag a task card
3. Drop on a different column
4. Verify task moves to new column
5. Test reordering within a column
6. Test on touch device (if available)

### 7. Submit Your PR

```bash
git add .
git commit -m "feat: add drag and drop with dnd-kit"
git push -u origin task-2.5-drag-drop
```

## Acceptance Criteria

- [ ] Tasks can be dragged with mouse
- [ ] Visual feedback during drag (overlay, opacity)
- [ ] Column highlights when dragging over
- [ ] Task moves to new column on drop
- [ ] State updates correctly after drag
- [ ] Small movement doesn't trigger drag (10px threshold)

## Bonus Challenges

1. Add reordering within columns
2. Add keyboard drag support
3. Add multi-select drag
4. Add drag preview/overlay

## Tips

- Use `closestCorners` for better drop detection
- Add activation constraint to prevent accidental drags
- The drag overlay creates a nicer visual effect
- Test touch interactions on mobile device

## Common Issues

**Issue:** Drag doesn't start
**Fix:** Check activationConstraint distance and sensor setup

**Issue:** Task drops in wrong column
**Fix:** Verify column.id matches in droppable and drop event

---

**Previous Task:** [Task 2.4: Implement Delete with Confirmation](../task-2.4/INSTRUCTIONS.md)
**Next Task:** [Task 2.6: Keyboard Accessibility](../task-2.6/INSTRUCTIONS.md)
