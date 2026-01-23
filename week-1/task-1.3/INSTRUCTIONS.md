# Task 1.3: Build a Button Component

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 45 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

## Objective

Create a reusable Button component with multiple variants (primary, secondary, danger) and sizes (sm, md, lg).

## The Situation

> **Alex Chen (Tech Lead):** "Consistent UI components are the foundation of a great product. We need a Button component that can be used throughout the app. It should support different styles for different use cases - primary actions, secondary actions, and dangerous actions like delete."

## Requirements

Build a `Button` component with:
- **3 Variants:** primary (blue), secondary (gray), danger (red)
- **3 Sizes:** sm, md, lg
- **States:** normal, hover, focus, disabled
- **Props:** Accepts all native button attributes (onClick, type, etc.)
- **Bonus:** Loading state with animated spinner

## Design Specifications

**Variants:**
- **Primary:** Blue background, white text (main actions)
- **Secondary:** Gray background, dark text (secondary actions)
- **Danger:** Red background, white text (destructive actions)

**Sizes:**
- **Small:** Compact padding, smaller text
- **Medium:** Default size, comfortable padding
- **Large:** Prominent, larger text and padding

**States:**
- **Hover:** Darker background color
- **Focus:** Ring/outline for keyboard navigation
- **Disabled:** Reduced opacity (50%), no pointer events

## Implementation Guide

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-1.3-button-component
```

### 2. Define TypeScript Types

Create `src/components/Button.tsx` starting with:

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
```

**Note:** `extends ButtonHTMLAttributes` gives you all native button props (onClick, disabled, type, etc.) for free!

### 3. Build Styling System

**Challenge:** Create a mapping object for each variant and size.

**Hint - Variant classes pattern:**
```tsx
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 ...',
  // TODO: Add secondary and danger
};
```

**Required Tailwind classes:**
- Background colors: `bg-{color}-600`
- Hover states: `hover:bg-{color}-700`
- Focus rings: `focus:ring-{color}-500`
- Text colors: `text-white` or `text-gray-800`

**Hint - Size classes:**
- Small: `px-3 py-1.5 text-sm`
- Medium: `px-4 py-2 text-base`
- Large: `px-6 py-3 text-lg`

**Base classes (applies to all buttons):**
```
inline-flex items-center justify-center font-medium rounded-md
focus:outline-none focus:ring-2 focus:ring-offset-2
transition-colors disabled:opacity-50 disabled:cursor-not-allowed
```

### 4. Implement the Component

**Your tasks:**
- Accept props with default values (variant='primary', size='md')
- Combine base classes + variant classes + size classes
- Use template literals or `className` library
- Spread remaining props: `{...props}`
- Disable button if `disabled` or `isLoading` is true

**Example usage your component should support:**
```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>

<Button variant="danger" disabled>
  Delete
</Button>

<Button isLoading>
  Submitting...
</Button>
```

### 5. BONUS: Add Loading Spinner

If `isLoading` is true, show a spinning icon before the children.

**Spinner SVG hint:**
```tsx
<svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
  {/* Use a circle with partial stroke for spinner effect */}
</svg>
```

### 6. Create Demo Page

Create `src/pages/Components.tsx` to showcase all variations:
- Section showing all 3 variants
- Section showing all 3 sizes
- Section showing different states (normal, disabled, loading)

### 7. Test Your Component

```bash
npm run dev
```

Navigate to http://localhost:3000/components and verify:
- All variants render with correct colors
- Hover states work
- Disabled buttons can't be clicked
- Sizes are visually distinct
- Loading spinner animates

### 8. Submit Your PR

```bash
git add .
git commit -m "feat: add reusable Button component with variants and sizes"
git push -u origin task-1.3-button-component
```

PR should include:
- Title: `Task 1.3: Button Component`
- Screenshots of all variants and sizes
- Explanation of your approach

## Acceptance Criteria

- [ ] Button supports primary, secondary, and danger variants
- [ ] Button supports sm, md, and lg sizes
- [ ] Disabled state reduces opacity and prevents clicks
- [ ] Hover states change background color
- [ ] Focus state shows keyboard outline
- [ ] Component properly typed with TypeScript
- [ ] Accepts and spreads all native button props
- [ ] Uses only Tailwind CSS (no custom CSS)
- [ ] Passes `npm run lint` with no errors

## Bonus Challenges

1. **Outline variant:** Border-only buttons with transparent background
2. **Icon support:** Accept `leftIcon` and `rightIcon` props
3. **Full width option:** `fullWidth` prop makes button 100% wide
4. **Link button:** Render as `<a>` tag when `href` prop is provided

## Resources

- [TypeScript Record Type](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
- [Tailwind Button Styles](https://tailwindcss.com/docs/background-color)
- [Extending HTML Attributes](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/#useful-react-prop-type-examples)

## Common Issues

**Classes not applying?**
- Tailwind requires full class names (can't use string interpolation like `bg-${color}-600`)
- Use Record objects for dynamic classes

**TypeScript errors on spread props?**
- Ensure you're extending `ButtonHTMLAttributes<HTMLButtonElement>`

**Disabled state not working?**
- Remember: `disabled={disabled || isLoading}`

---

**Previous Task:** [Task 1.2: Create Your Developer Profile](../task-1.2/INSTRUCTIONS.md)
**Next Task:** [Task 1.4: Create Task Card Component](../task-1.4/INSTRUCTIONS.md)
