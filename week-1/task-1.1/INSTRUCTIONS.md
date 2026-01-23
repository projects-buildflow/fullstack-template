# Task 1.1: Environment Setup

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 25 XP | 20 min | Token verification |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
- [All Tasks Overview](../../docs/week-1-tasks.md)

## Objective

Set up your local development environment and verify everything works correctly.

## The Situation

> **Alex Chen (Tech Lead):** "Welcome to TaskMaster! Before you start building features, we need to make sure your dev environment is properly configured. This ensures everyone on the team has a consistent setup. Run through these steps and verify everything works."

## Steps

### 1. Check Node.js Version

Open your terminal and verify you have Node.js 18+:

```bash
node --version
# Should output v18.x.x or higher
```

If not installed or outdated, download from [nodejs.org](https://nodejs.org/).

### 2. Clone Your Repository

```bash
git clone <your-repo-url>
cd taskmaster-<your-username>
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages including React, TypeScript, and Tailwind CSS.

### 4. Configure Git

Make sure Git knows who you are:

```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

### 5. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see the TaskMaster welcome page.

### 6. Verify Your Setup

Run the verification script:

```bash
npm run verify
```

If everything is configured correctly, you'll see a verification token:

```
TASKMASTER-XXXXXXXXXXXX-XXXX
```

## Submitting Your Token

Go to your Tasks page, click on Task 1.1, and enter your token in the form.

## Troubleshooting

**"Node version too low"**
- Install Node.js 18+ from nodejs.org
- If using nvm: `nvm install 18 && nvm use 18`

**"npm install" fails**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**Port 3000 already in use**
- Use a different port: `npm run dev -- --port 3001`

**"Script not found"**
- Make sure you're in the repository root directory
- The verify script is at `scripts/verify.js`

## Tips

- Use VS Code for the best development experience
- Install the ESLint and Prettier extensions
- Keep the dev server running while working on tasks

---

**Next Task:** [Task 1.2: Create Your Developer Profile](../task-1.2/INSTRUCTIONS.md)
