# Task 4.5: Deployment Setup

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)

## Objective

Deploy your application to a cloud platform (Vercel/Railway) with environment configuration.

## The Situation

> **Alex Chen (Tech Lead):** "Time to ship! We'll deploy the frontend to Vercel (great for React apps) and the backend to Railway (simple Node.js hosting). You'll learn about environment variables, CI/CD, and production configurations."

## Deployment Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│    Vercel       │         │    Railway      │         │   Supabase      │
│   (Frontend)    │────────▶│   (Backend)     │────────▶│   (Database)    │
│                 │  HTTPS  │                 │  HTTPS  │                 │
│ React + Vite    │         │ Node + Express  │         │   PostgreSQL    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-4.5-deployment
```

### 2. Prepare Frontend for Production

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Update environment variables:

```typescript
// src/config.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  environment: import.meta.env.MODE,
};
```

### 3. Prepare Backend for Production

Create `Procfile` in server directory:

```
web: node index.js
```

Update `server/index.js`:

```javascript
// TODO: Add production middleware
// Install: npm install helmet express-rate-limit

// TODO: Add helmet for security headers
// app.use(helmet());

// TODO: Add rate limiting
// 100 requests per 15 minutes per IP

// TODO: Configure CORS for production
// Allow only FRONTEND_URL from environment

// TODO: Add health check endpoint
// GET /health returns { status: 'ok' }
```

### 4. Deploy Backend to Railway

**Step-by-step guide:**

1. **Create Railway Account**
   - Visit railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `server` directory as root

3. **Add Environment Variables**
   ```
   DATABASE_URL=your-supabase-connection-string
   JWT_SECRET=your-long-random-secret
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   PORT=3001
   ```

4. **Generate Domain**
   - Go to Settings > Networking
   - Generate a public domain
   - Save the URL (e.g., `your-app.railway.app`)

### 5. Deploy Frontend to Vercel

**Step-by-step guide:**

1. **Create Vercel Account**
   - Visit vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to frontend folder (if not at root)

3. **Configure Environment Variables**
   ```
   VITE_API_URL=https://your-api.railway.app/api
   ```

4. **Deploy**
   - Vercel builds and deploys automatically
   - Get your production URL

### 6. Set Up Database on Supabase

**Step-by-step guide:**

1. **Create Supabase Project**
   - Visit supabase.com
   - Create new project
   - Wait for setup to complete

2. **Run Migrations**
   - Go to SQL Editor
   - Copy your `schema.sql` and run it
   - Optionally run `seed.sql` for test data

3. **Get Connection String**
   - Go to Settings > Database
   - Copy the connection string
   - Add to Railway environment variables

### 7. Create GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # TODO: Setup Node.js

      # TODO: Install dependencies

      # TODO: Run linter

      # TODO: Run tests
```

### 8. Update README with Deployment Info

Add to your README:

```markdown
## Deployment

### Production URLs
- Frontend: https://taskmaster.vercel.app
- API: https://taskmaster-api.railway.app

### Environment Variables

#### Frontend (Vercel)
- `VITE_API_URL` - Backend API URL

#### Backend (Railway)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Set to `production`
```

### 9. Verify Deployment

Checklist:
- [ ] Visit Vercel URL - app loads
- [ ] Test login/register
- [ ] Create a task
- [ ] Refresh - task persists
- [ ] Check API health endpoint

### 10. Submit Your PR

```bash
git add .
git commit -m "feat: add deployment configuration for Vercel and Railway"
git push -u origin task-4.5-deployment
```

## Acceptance Criteria

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Database on Supabase
- [ ] Environment variables configured correctly
- [ ] CORS configured for production domain
- [ ] Health check endpoint works
- [ ] App functions correctly in production

## Environment Variables Reference

**Frontend (.env):**
```
VITE_API_URL=https://your-api.railway.app/api
```

**Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key-change-this
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PORT=3001
```

## Tips

- Never commit secrets to git - use environment variables
- Test on preview deployments before merging to main
- Set up error monitoring (Sentry) for production
- Use strong JWT_SECRET in production
- Enable HTTPS only in production

## Troubleshooting

**"Failed to fetch" errors:**
- Check CORS configuration
- Verify API URL is correct
- Check Railway logs

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check Supabase connection pooling settings

**Build errors:**
- Check all dependencies are in package.json
- Verify build command is correct

---

**Previous Task:** [Task 4.4: Responsive Design](../task-4.4/INSTRUCTIONS.md)
**Next Task:** [Task 4.6: Final Presentation](../task-4.6/INSTRUCTIONS.md)
