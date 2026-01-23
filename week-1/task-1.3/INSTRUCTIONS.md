# Task 1.3: Build a Button Component

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 45 min | Pull Request |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Objective

Create a reusable Button component with multiple variants (primary, secondary, danger) and sizes (sm, md, lg).

## The Situation

> **Alex Chen (Tech Lead):** "Consistent UI components are the foundation of a great product. We need a Button component that can be used throughout the app. It should support different styles for different use cases - primary actions, secondary actions, and dangerous actions like delete."

## Requirements

Build a `Button` component with:
- **Variants:** primary (blue), secondary (gray), danger (red)
- **Sizes:** sm, md, lg
- **States:** normal, hover, disabled
- **Loading state** with spinner (bonus)

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-1.3-button-component
```

### 2. Create the Button Component

Create `src/components/Button.tsx`:

```tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
```

### 3. Create a Demo Page

Create `src/pages/Components.tsx` to showcase your button:

```tsx
import { Button } from '../components/Button';

export function ComponentsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Component Library</h1>

      {/* Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
        <div className="flex gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
        <div className="flex items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* States */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Button States</h2>
        <div className="flex gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
        </div>
      </section>
    </div>
  );
}
```

### 4. Test Your Component

1. Navigate to http://localhost:3000/components
2. Verify all variants display correctly
3. Test hover and disabled states
4. Check the loading spinner animation

### 5. Submit Your PR

```bash
git add .
git commit -m "feat: add reusable Button component with variants and sizes"
git push -u origin task-1.3-button-component
```

Create a PR with:
- Title: `Task 1.3: Button Component`
- Screenshots of each variant and size
- Brief explanation of your design decisions

## Acceptance Criteria

- [ ] Button supports primary, secondary, and danger variants
- [ ] Button supports sm, md, and lg sizes
- [ ] Disabled state reduces opacity and prevents clicks
- [ ] Loading state shows spinner and disables button
- [ ] Component is properly typed with TypeScript
- [ ] Uses Tailwind CSS for styling
- [ ] Passes lint checks

## Bonus Challenges

1. Add an `outline` variant for bordered buttons
2. Add icon support (left and right icons)
3. Create a `LinkButton` variant that renders as an `<a>` tag

## Tips

- Use TypeScript union types for variant and size props
- Spread remaining props to allow custom attributes
- Test accessibility - buttons should be keyboard focusable

---

**Previous Task:** [Task 1.2: Create Your Developer Profile](../task-1.2/INSTRUCTIONS.md)
**Next Task:** [Task 1.4: Create Task Card Component](../task-1.4/INSTRUCTIONS.md)
