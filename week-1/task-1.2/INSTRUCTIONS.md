# Task 1.2: Create Your Developer Profile

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 30 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## Objective

Create your developer profile card component and introduce yourself to the team via your first pull request.

## The Situation

> **Sarah Johnson (Frontend Developer):** "Every new team member creates a profile card that shows on our team page. This is a great way to practice React basics while introducing yourself. Plus, you'll learn our PR workflow!"

## Requirements

Build a `DeveloperProfile` component that displays:
- Your name
- Your GitHub avatar (fetched from GitHub)
- A short bio (2-3 sentences)
- Your location (optional)
- Link to your GitHub profile

## Design Specifications

**Component should:**
- Be a card with white background, rounded corners, and subtle shadow
- Center the avatar (circular, 96px × 96px)
- Display name prominently below avatar
- Show GitHub username with @ prefix in gray
- Include clickable link to GitHub profile
- Be responsive (max-width: 384px)

**Visual hierarchy:**
```
┌─────────────────────┐
│    [Avatar Image]   │
│     Your Name       │
│   @your-username    │
│   City, Country     │
│                     │
│   Your bio text...  │
│                     │
│ View GitHub Profile │
└─────────────────────┘
```

## Implementation Guide

### 1. Create a New Branch

```bash
git checkout -b task-1.2-developer-profile
```

### 2. Create the Component

Create `src/components/DeveloperProfile.tsx` with:

**Props Interface:**
```tsx
interface DeveloperProfileProps {
  name: string;
  githubUsername: string;
  bio: string;
  location?: string;
}
```

**Your tasks:**
- Create the component function accepting these props
- Build the avatar URL: `https://github.com/${githubUsername}.png`
- Return JSX with card layout (see design specs above)
- Style with Tailwind CSS classes

**Tailwind hints:**
- Card: `bg-white`, `rounded-lg`, `shadow-md`, `p-6`, `max-w-sm`
- Avatar: `w-24`, `h-24`, `rounded-full`, `mx-auto`, `mb-4`
- Name: `text-xl`, `font-bold`, `text-center`
- Username: `text-gray-500`, `text-center`
- Link: `text-blue-600`, `hover:underline`

### 3. Add to Team Page

Create or update `src/pages/Team.tsx`:
- Import your `DeveloperProfile` component
- Create a grid layout for multiple profiles
- Add your profile with real information

**Grid layout suggestion:**
- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop

### 4. Test Your Changes

```bash
npm run dev
```

Navigate to http://localhost:3000/team and verify:
- Avatar loads from GitHub
- All text displays correctly
- Link opens GitHub in new tab
- Responsive layout works

### 5. Submit Your PR

```bash
git add .
git commit -m "feat: add developer profile card for [Your Name]"
git push -u origin task-1.2-developer-profile
```

Create PR on GitHub:
- Title: `Task 1.2: Developer Profile - [Your Name]`
- Include a screenshot of your profile card
- Mention what you learned

## Acceptance Criteria

- [ ] Component is properly typed with TypeScript
- [ ] Displays GitHub avatar using correct URL pattern
- [ ] Shows all required information (name, username, bio)
- [ ] GitHub link opens in new tab (`target="_blank"`, `rel="noopener noreferrer"`)
- [ ] Uses Tailwind CSS (no custom CSS)
- [ ] Passes `npm run lint` with no errors
- [ ] Profile appears on /team page

## Resources

- [GitHub Avatar API](https://docs.github.com/en/rest/users) - `https://github.com/{username}.png`
- [React Props](https://react.dev/learn/passing-props-to-a-component)
- [Tailwind Grid](https://tailwindcss.com/docs/grid-template-columns)

## Common Issues

**Avatar not loading?**
- Check username spelling
- GitHub avatars are public - no auth needed

**TypeScript errors?**
- Ensure all props are defined in interface
- Optional props use `?` syntax

**Link not working?**
- Use template literal: `` `https://github.com/${githubUsername}` ``
- Include `target="_blank"` for new tab

---

**Previous Task:** [Task 1.1: Environment Setup](../task-1.1/INSTRUCTIONS.md)
**Next Task:** [Task 1.3: Build a Button Component](../task-1.3/INSTRUCTIONS.md)
