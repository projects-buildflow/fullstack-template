# Task 3.5: Implement User Authentication

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 90 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [JWT.io](https://jwt.io/)

## Objective

Add user authentication using JWT tokens, including login, logout, and protected routes.

## The Situation

> **Alex Chen (Tech Lead):** "We need to secure our app! Users should be able to sign up, log in, and only see their own boards. We'll use JWT tokens - they're stateless and work great with our API architecture."

## Requirements

Implement authentication:
- User registration endpoint
- Login endpoint returning JWT
- Protected API routes with middleware
- Auth context in React
- Login/Register pages
- Protected route component

## JWT Authentication Flow

```
┌─────────┐                ┌─────────┐                ┌──────────┐
│ Client  │                │  API    │                │ Database │
└────┬────┘                └────┬────┘                └────┬─────┘
     │                          │                          │
     │ POST /auth/register      │                          │
     ├─────────────────────────►│ Hash password            │
     │  {email, password, name} ├─────────────────────────►│
     │                          │ Create user              │
     │                          │◄─────────────────────────┤
     │                          │ Generate JWT             │
     │◄─────────────────────────┤                          │
     │ {user, token}            │                          │
     │                          │                          │
     │ GET /api/tasks           │                          │
     │ Header: Bearer <token>   │                          │
     ├─────────────────────────►│ Verify JWT               │
     │                          │ Extract userId           │
     │                          ├─────────────────────────►│
     │                          │ Query user's tasks       │
     │                          │◄─────────────────────────┤
     │◄─────────────────────────┤                          │
     │ {tasks: [...]}           │                          │
```

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-3.5-authentication
```

### 2. Install Auth Dependencies

```bash
cd server
npm install jsonwebtoken bcryptjs
```

### 3. Create Auth Routes

Create `server/routes/auth.js`:

```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    // TODO: Get email, password, name from req.body

    // TODO: Validate input (all fields required, password length >= 6)

    // TODO: Check if user already exists (query by email)

    // TODO: Hash password with bcrypt.hash(password, 10)

    // TODO: Insert user into database
    // INSERT INTO users (email, password_hash, name) VALUES (...) RETURNING id, email, name

    // TODO: Generate JWT token
    // jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    // TODO: Return 201 with { user, token }
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    // TODO: Get email, password from req.body

    // TODO: Find user by email
    // SELECT id, email, name, password_hash FROM users WHERE email = $1

    // TODO: If not found, return 401 'Invalid email or password'

    // TODO: Compare password with bcrypt.compare(password, user.password_hash)

    // TODO: If invalid, return 401

    // TODO: Generate JWT token

    // TODO: Return { user: { id, email, name }, token }
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me - Get current user
router.get('/me', async (req, res, next) => {
  try {
    // TODO: Get Authorization header
    // Check for 'Bearer <token>' format

    // TODO: Extract token and verify with jwt.verify(token, JWT_SECRET)

    // TODO: Get userId from decoded token

    // TODO: Query user by id

    // TODO: Return { user }
  } catch (err) {
    // TODO: Handle JsonWebTokenError -> return 401 'Invalid token'
    next(err);
  }
});

module.exports = router;
```

### 4. Create Auth Middleware

Create `server/middleware/auth.js`:

```javascript
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function authMiddleware(req, res, next) {
  // TODO: Get Authorization header

  // TODO: Check for 'Bearer ' prefix
  // If missing, return 401 'Authorization required'

  // TODO: Extract token (split by space, take second part)

  // TODO: Verify token with jwt.verify()

  // TODO: Add userId to req object (req.userId = decoded.userId)

  // TODO: Call next() to continue

  // TODO: Catch errors and return 401 'Invalid or expired token'
}

module.exports = authMiddleware;
```

### 5. Protect API Routes

Update `server/index.js`:

```javascript
const authMiddleware = require('./middleware/auth');

// Public routes
app.use('/api/auth', require('./routes/auth'));

// TODO: Protect these routes with authMiddleware
// app.use('/api/tasks', authMiddleware, require('./routes/tasks'));
// app.use('/api/columns', authMiddleware, require('./routes/columns'));
// app.use('/api/boards', authMiddleware, require('./routes/boards'));
```

### 6. Create Auth Context (Frontend)

Create `src/context/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/client';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Check token on mount
  useEffect(() => {
    async function checkAuth() {
      // If no token, set isLoading false and return
      // Try to fetch current user with token
      // If successful, set user
      // If error, clear token from localStorage
      // Set isLoading false
    }
    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    // TODO: Call api.login(email, password)
    // Save token to localStorage
    // Update token and user state
  };

  const register = async (email: string, password: string, name: string) => {
    // TODO: Call api.register(email, password, name)
    // Save token to localStorage
    // Update token and user state
  };

  const logout = () => {
    // TODO: Clear token from localStorage
    // Reset token and user to null
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 7. Create Protected Route Component

Create `src/components/ProtectedRoute.tsx`:

```tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // TODO: Show loading spinner if isLoading

  // TODO: Redirect to /login if no user (save current location in state)

  // TODO: Render children if authenticated
}
```

### 8. Create Login Page

Create `src/pages/Login.tsx`:

```tsx
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Call login(email, password)
      // Navigate to '/' on success
    } catch (err) {
      // TODO: Set error message
    }
  };

  // TODO: Render form with email and password inputs
  // Include link to /register
}
```

### 9. Submit Your PR

```bash
git add .
git commit -m "feat: add JWT authentication"
git push -u origin task-3.5-authentication
```

## Acceptance Criteria

- [ ] Register endpoint creates user and returns JWT
- [ ] Login endpoint validates credentials and returns JWT
- [ ] /me endpoint returns current user from token
- [ ] Auth middleware protects API routes
- [ ] AuthContext manages user state
- [ ] ProtectedRoute redirects unauthenticated users
- [ ] Token persisted in localStorage
- [ ] Password is hashed with bcrypt (NEVER stored plain)

## Tips

- Never store plain passwords - always hash with bcrypt
- Use strong JWT_SECRET in production (long random string)
- httpOnly cookies are more secure than localStorage (but harder to implement)
- Add token refresh mechanism for long sessions
- Consider adding "Remember Me" functionality

## Security Notes

**DO:**
- Hash passwords with bcrypt
- Use environment variables for secrets
- Validate all input
- Return generic errors for auth failures

**DON'T:**
- Store passwords in plain text
- Commit secrets to git
- Return specific error messages (e.g., "email not found" vs "invalid credentials")

---

**Previous Task:** [Task 3.4: Add Error Handling](../task-3.4/INSTRUCTIONS.md)
**Next Task:** [Task 4.1: Add Search & Filter](../../week-4/task-4.1/INSTRUCTIONS.md)
