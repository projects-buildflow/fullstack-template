# Task 4.5: Deployment Setup

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 60 min | Pull Request |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)

## Objective

Deploy your application to a cloud platform (Vercel/Railway) with environment configuration.

## The Situation

> **Alex Chen (Tech Lead):** "Time to ship! We'll deploy the frontend to Vercel (great for React apps) and the backend to Railway (simple Node.js hosting). You'll learn about environment variables, CI/CD, and production configurations."

## Requirements

Deploy the application:
- Frontend deployed to Vercel
- Backend deployed to Railway (or Render)
- Database on Supabase
- Environment variables configured
- Custom domain (optional)

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
  ],
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

Update environment variables in your app:

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

Update `server/index.js` for production:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS - allow frontend origin in production
app.use(cors({
  origin: isProduction
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Health check for deployment platform
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
// ... other routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Install production dependencies:

```bash
npm install helmet express-rate-limit
```

### 4. Deploy Backend to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `server` directory

3. **Add Environment Variables**
   In Railway dashboard, add:
   ```
   DATABASE_URL=your-supabase-url
   JWT_SECRET=your-jwt-secret
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Generate Domain**
   - Go to Settings > Domains
   - Generate a Railway domain or add custom

### 5. Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to frontend folder

3. **Configure Environment Variables**
   In Vercel dashboard:
   ```
   VITE_API_URL=https://your-api.railway.app/api
   ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Get your production URL

### 6. Set Up Database on Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project

2. **Run Migrations**
   - Go to SQL Editor
   - Run your `schema.sql`
   - Run your `seed.sql` (optional for prod)

3. **Get Connection String**
   - Go to Settings > Database
   - Copy the connection string
   - Add to Railway environment variables

### 7. Create GitHub Actions for CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
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

1. Visit your Vercel URL
2. Test login/register
3. Create a task
4. Verify data persists
5. Check API health endpoint

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
- [ ] Environment variables configured
- [ ] CORS configured for production
- [ ] Health check endpoint works
- [ ] App functions correctly in production

## Tips

- Never commit secrets to git - use environment variables
- Test on preview deployments before merging
- Set up error monitoring (Sentry) for production

---

**Previous Task:** [Task 4.4: Responsive Design](../task-4.4/INSTRUCTIONS.md)
**Next Task:** [Task 4.6: Final Presentation](../task-4.6/INSTRUCTIONS.md)
