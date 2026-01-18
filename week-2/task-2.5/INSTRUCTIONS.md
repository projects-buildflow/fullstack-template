# Task 2.5: Add Drag and Drop

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 100 XP | 90 min | Pull Request |

## Quick Links

- [Discord #ask-alex](https://discord.com/channels/taskmaster/ask-alex) - Get help
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

### 3. Create DraggableTaskCard

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onClick={onClick}
        onDelete={onDelete}
      />
    </div>
  );
}
```

### 4. Create DroppableColumn

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

export function DroppableColumn({
  column,
  taskIds,
  children,
  onAddTask,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      className={`flex flex-col bg-gray-100 rounded-lg w-80 max-h-[calc(100vh-12rem)] ${
        isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="font-semibold text-gray-900 flex-1">{column.title}</h2>
          <span className="px-2 py-0.5 text-sm font-medium text-gray-600 bg-gray-200 rounded-full">
            {taskIds.length}
          </span>
        </div>
      </div>

      {/* Sortable Task List */}
      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[100px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>

      {/* Add Task Button */}
      {onAddTask && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onAddTask}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center gap-1"
          >
            + Add Task
          </button>
        </div>
      )}
    </div>
  );
}
```

### 5. Create DragOverlay Component

Create `src/components/TaskDragOverlay.tsx`:

```tsx
import { DragOverlay } from '@dnd-kit/core';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface TaskDragOverlayProps {
  activeTask: Task | null;
}

export function TaskDragOverlay({ activeTask }: TaskDragOverlayProps) {
  return (
    <DragOverlay>
      {activeTask && (
        <div className="shadow-lg rotate-3">
          <TaskCard task={activeTask} />
        </div>
      )}
    </DragOverlay>
  );
}
```

### 6. Update Board with DndContext

Update `src/components/Board.tsx`:

```tsx
import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useBoard } from '../context/BoardContext';
import { DroppableColumn } from './DroppableColumn';
import { DraggableTaskCard } from './DraggableTaskCard';
import { TaskDragOverlay } from './TaskDragOverlay';
import { Task } from '../types/task';

export function Board() {
  const { state, moveTask } = useBoard();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10px movement before drag starts
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = state.tasks[active.id as string];
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = state.tasks[activeId];
    if (!activeTask) return;

    // Find the target column
    const overColumn = state.columns.find(
      (col) => col.id === overId || col.taskIds.includes(overId)
    );

    if (!overColumn) return;

    // If dropped in a different column
    if (activeTask.columnId !== overColumn.id) {
      moveTask(activeId, activeTask.columnId, overColumn.id);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = state.tasks[activeId];
    if (!activeTask) return;

    // Find columns
    const activeColumn = state.columns.find((col) => col.id === activeTask.columnId);
    const overColumn = state.columns.find(
      (col) => col.id === overId || col.taskIds.includes(overId)
    );

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    // Move to new column
    moveTask(activeId, activeColumn.id, overColumn.id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-6 overflow-x-auto p-6 min-h-screen bg-gray-50">
        {state.columns.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            taskIds={column.taskIds}
          >
            {column.taskIds.map((taskId) => (
              <DraggableTaskCard
                key={taskId}
                task={state.tasks[taskId]}
              />
            ))}
          </DroppableColumn>
        ))}
      </div>

      <TaskDragOverlay activeTask={activeTask} />
    </DndContext>
  );
}
```

### 7. Test Drag and Drop

1. Start the dev server
2. Drag a task card
3. Drop on a different column
4. Verify task moves to new column
5. Test reordering within a column
6. Test on touch device (if available)

### 8. Submit Your PR

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

## Tips

- Use `closestCorners` for better drop detection
- Add activation constraint to prevent accidental drags
- The drag overlay creates a nicer visual effect

---

**Previous Task:** [Task 2.4: Implement Delete with Confirmation](../task-2.4/INSTRUCTIONS.md)
**Next Task:** [Task 2.6: Keyboard Accessibility](../task-2.6/INSTRUCTIONS.md)
