# Task 4.4: Responsive Design

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [Tailwind Responsive](https://tailwindcss.com/docs/responsive-design)

## Objective

Make the Kanban board fully responsive and usable on mobile devices.

## The Situation

> **Marcus Williams (Backend Engineer):** "Our users want to check their tasks on the go! The board needs to work on phones and tablets. Consider touch interactions, screen space, and mobile-first patterns."

## Requirements

Make the app responsive:
- Mobile-first approach
- Collapsible sidebar on mobile
- Horizontal scroll for board on small screens
- Touch-friendly interactions
- Proper spacing and sizing

## Mobile Design Patterns

```
Mobile (< 768px)        Tablet (768-1024px)      Desktop (> 1024px)
┌─────────────┐        ┌──────────────────┐     ┌────────────────────┐
│   Header    │        │     Header       │     │  Header + Nav      │
├─────────────┤        ├──────────────────┤     ├────────────────────┤
│             │        │                  │     │                    │
│   Board     │        │   Board          │     │   Board            │
│  (h-scroll) │        │  (h-scroll)      │     │   (no scroll)      │
│             │        │                  │     │                    │
├─────────────┤        └──────────────────┘     └────────────────────┘
│  Bottom Nav │
└─────────────┘
```

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-4.4-responsive
```

### 2. Create Responsive Navigation

Create `src/components/MobileNav.tsx`:

```tsx
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Board', icon: '📋' },
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export function MobileNav() {
  const location = useLocation();

  // TODO: Render fixed bottom navigation (only on mobile)
  // Use md:hidden to hide on desktop
  // Show icon and label for each nav item
  // Highlight active route
}
```

### 3. Update Board for Mobile

Update `src/components/Board.tsx`:

```tsx
export function Board() {
  return (
    <div className="h-screen flex flex-col">
      {/* TODO: Header - hidden on mobile */}
      {/* Use hidden md:flex */}

      {/* TODO: Board - horizontal scroll on all sizes */}
      {/* overflow-x-auto on parent, min-w-max on children */}

      {/* TODO: Mobile bottom padding for nav */}
      {/* h-16 md:hidden to reserve space */}
    </div>
  );
}
```

### 4. Make Column Component Responsive

Update `src/components/Column.tsx`:

```tsx
export function Column({ column, taskCount, children, className = '' }: ColumnProps) {
  // TODO: Adjust column width for different screens
  // w-72 md:w-80 (narrower on mobile)

  // TODO: Adjust max height based on viewport
  // max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-6rem)]

  // TODO: Make "Add Task" button touch-friendly
  // Add touch-manipulation class
  // Use py-3 for larger tap target (minimum 44px)
}
```

### 5. Responsive Breakpoints

Use Tailwind breakpoints:

```tsx
// Example responsive classes:
className="
  text-sm md:text-base          // Smaller text on mobile
  p-3 md:p-4                     // Less padding on mobile
  hidden md:block                // Hide on mobile
  block md:hidden                // Show only on mobile
  grid-cols-1 md:grid-cols-2     // Stack on mobile
  gap-2 md:gap-4                 // Smaller gaps on mobile
"
```

### 6. Make TaskCard Touch-Friendly

Update `src/components/TaskCard.tsx`:

```tsx
export function TaskCard({ task }: TaskCardProps) {
  // TODO: Add touch-friendly classes
  // touch-manipulation - faster tap response
  // active:scale-[0.98] - visual feedback on press

  // TODO: Adjust text sizes for mobile
  // text-sm md:text-base for title

  // TODO: Limit description lines on mobile
  // line-clamp-1 md:line-clamp-2

  // TODO: Hide or abbreviate labels on small screens
  // hidden sm:inline for assignee name
}
```

### 7. Create Mobile-Friendly Modal

Update `src/components/Modal.tsx`:

```tsx
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* TODO: Bottom sheet on mobile, centered on desktop */}
      <div className="
        relative bg-white w-full
        md:max-w-md md:mx-4 md:rounded-lg
        rounded-t-2xl
        max-h-[90vh] overflow-y-auto
      ">
        {/* TODO: Add drag handle for mobile (hidden on desktop) */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Modal content */}
      </div>
    </div>
  );
}
```

### 8. Test on Different Devices

Test your responsive design:
- Mobile (375px width) - iPhone SE
- Mobile (390px width) - iPhone 12/13
- Tablet (768px width) - iPad
- Desktop (1024px+ width)

Use Chrome DevTools device emulator:
1. Open DevTools (F12)
2. Click device toolbar icon
3. Test different screen sizes

### 9. Submit Your PR

```bash
git add .
git commit -m "feat: add responsive design for mobile and tablet"
git push -u origin task-4.4-responsive
```

## Acceptance Criteria

- [ ] Board scrolls horizontally on mobile
- [ ] Mobile navigation at bottom (hidden on desktop)
- [ ] Modals display as bottom sheets on mobile
- [ ] Touch targets are at least 44px tall
- [ ] Text is readable on small screens (min 14px)
- [ ] No horizontal overflow on any screen size
- [ ] Works on iOS and Android browsers

## Responsive Design Checklist

**Layout:**
- [ ] Horizontal scroll for board columns
- [ ] Stack grids on mobile
- [ ] Bottom navigation on mobile

**Typography:**
- [ ] Readable font sizes (14px minimum)
- [ ] Line clamping for long text

**Touch Targets:**
- [ ] Minimum 44px height for buttons
- [ ] touch-manipulation for faster taps
- [ ] Visual feedback on press

**Spacing:**
- [ ] Reduced padding on mobile
- [ ] Smaller gaps between elements

## Tips

- Use Tailwind's responsive prefixes: `md:`, `lg:`, etc.
- Test on real devices, not just DevTools
- Use `touch-manipulation` for better touch response
- Consider landscape orientation on mobile

## Key Concepts

**Mobile-First:** Design for mobile, then add desktop features
**Touch Targets:** Minimum 44x44px for easy tapping
**Bottom Sheet:** Modal that slides up from bottom (mobile pattern)

---

**Previous Task:** [Task 4.3: Performance Optimization](../task-4.3/INSTRUCTIONS.md)
**Next Task:** [Task 4.5: Deployment Setup](../task-4.5/INSTRUCTIONS.md)
