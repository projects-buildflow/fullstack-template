# Task 1.2: Create Your Developer Profile

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 30 min | Pull Request |

## Quick Links

- [Discord #ask-alex](https://discord.com/channels/taskmaster/ask-alex) - Get help
- [React Documentation](https://react.dev/)

## Objective

Create your developer profile card component and introduce yourself to the team via your first pull request.

## The Situation

> **Sarah Johnson (Frontend Developer):** "Every new team member creates a profile card that shows on our team page. This is a great way to practice React basics while introducing yourself. Plus, you'll learn our PR workflow!"

## Requirements

Create a `DeveloperProfile` component that displays:
- Your name
- Your GitHub avatar
- A short bio (2-3 sentences)
- Your location (optional)
- Links to your GitHub profile

## Steps

### 1. Create a New Branch

```bash
git checkout -b task-1.2-developer-profile
```

### 2. Create the Component

Create a new file: `src/components/DeveloperProfile.tsx`

```tsx
interface DeveloperProfileProps {
  name: string;
  githubUsername: string;
  bio: string;
  location?: string;
}

export function DeveloperProfile({
  name,
  githubUsername,
  bio,
  location
}: DeveloperProfileProps) {
  const avatarUrl = `https://github.com/${githubUsername}.png`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm">
      <img
        src={avatarUrl}
        alt={name}
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-bold text-center">{name}</h2>
      <p className="text-gray-500 text-center mb-2">@{githubUsername}</p>
      {location && (
        <p className="text-gray-400 text-sm text-center mb-4">{location}</p>
      )}
      <p className="text-gray-700 text-center">{bio}</p>
      <a
        href={`https://github.com/${githubUsername}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-4 text-center text-blue-600 hover:underline"
      >
        View GitHub Profile
      </a>
    </div>
  );
}
```

### 3. Add Your Profile to the Team Page

Open `src/pages/Team.tsx` and add your profile:

```tsx
import { DeveloperProfile } from '../components/DeveloperProfile';

export function TeamPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DeveloperProfile
          name="Your Name"
          githubUsername="your-username"
          bio="Your bio goes here. Tell us about yourself!"
          location="Your City, Country"
        />
      </div>
    </div>
  );
}
```

### 4. Test Your Changes

1. Run `npm run dev` if not already running
2. Navigate to http://localhost:3000/team
3. Verify your profile card appears correctly

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add developer profile card for [Your Name]"
git push -u origin task-1.2-developer-profile
```

### 6. Create a Pull Request

1. Go to your repository on GitHub
2. Click "Compare & pull request"
3. Title: `Task 1.2: Developer Profile - [Your Name]`
4. Description: Include a screenshot of your profile card
5. Submit the PR

## Acceptance Criteria

- [ ] Component accepts name, githubUsername, bio, and optional location props
- [ ] Displays GitHub avatar using the GitHub avatar URL pattern
- [ ] Shows your name and GitHub username
- [ ] Includes a link to your GitHub profile
- [ ] Uses Tailwind CSS for styling
- [ ] Code passes lint checks (`npm run lint`)

## Tips

- Use the GitHub avatar URL pattern: `https://github.com/{username}.png`
- Make your bio genuine - this is how the team gets to know you!
- Keep components simple and focused on one thing

---

**Previous Task:** [Task 1.1: Environment Setup](../task-1.1/INSTRUCTIONS.md)
**Next Task:** [Task 1.3: Build a Button Component](../task-1.3/INSTRUCTIONS.md)
