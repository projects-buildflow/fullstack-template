# Task 3.5: Implement User Authentication

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 75 XP | 90 min | Pull Request |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
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
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        error: { message: 'Email, password, and name are required', status: 400 },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: { message: 'Password must be at least 6 characters', status: 400 },
      });
    }

    // Check if user exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: { message: 'Email already registered', status: 409 },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, passwordHash, name]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required', status: 400 },
      });
    }

    // Find user
    const result = await db.query(
      'SELECT id, email, name, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: { message: 'Invalid email or password', status: 401 },
      });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({
        error: { message: 'Invalid email or password', status: 401 },
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me - Get current user
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { message: 'No token provided', status: 401 },
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await db.query(
      'SELECT id, email, name, avatar_url FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: { message: 'User not found', status: 401 },
      });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: { message: 'Invalid token', status: 401 },
      });
    }
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
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { message: 'Authorization required', status: 401 },
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      error: { message: 'Invalid or expired token', status: 401 },
    });
  }
}

module.exports = authMiddleware;
```

### 5. Protect API Routes

Update `server/index.js`:

```javascript
const authMiddleware = require('./middleware/auth');

// Public routes
app.use('/api/auth', require('./routes/auth'));

// Protected routes
app.use('/api/tasks', authMiddleware, require('./routes/tasks'));
app.use('/api/columns', authMiddleware, require('./routes/columns'));
app.use('/api/boards', authMiddleware, require('./routes/boards'));
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

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState(true);

  // Check token on mount
  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { user } = await api.getMe(token);
        setUser(user);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { user, token } = await api.login(email, password);
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const register = async (email: string, password: string, name: string) => {
    const { user, token } = await api.register(email, password, name);
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

### 8. Create Login Page

Create `src/pages/Login.tsx` (simplified):

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
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {/* Form fields... */}
        <Link to="/register">Create an account</Link>
      </form>
    </div>
  );
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

## Tips

- Never store plain passwords - always hash
- Use httpOnly cookies for production (more secure)
- Add token refresh mechanism for long sessions

---

**Previous Task:** [Task 3.4: Add Error Handling](../task-3.4/INSTRUCTIONS.md)
**Next Task:** [Task 3.6: API Documentation](../task-3.6/INSTRUCTIONS.md)
