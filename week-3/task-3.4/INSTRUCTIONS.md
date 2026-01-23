# Task 3.4: Add Error Handling

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 45 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

## Objective

Implement comprehensive error handling with user-friendly error messages and retry logic.

## The Situation

> **Marcus Williams (Backend Engineer):** "Things will go wrong - network issues, server errors, validation failures. We need to handle these gracefully so users know what happened and can recover. No cryptic error messages!"

## Requirements

Implement error handling:
- Global error boundary for React errors
- Toast notifications for API errors
- Retry logic for failed requests
- User-friendly error messages
- Offline detection

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-3.4-error-handling
```

### 2. Create Error Boundary

Create `src/components/ErrorBoundary.tsx`:

```tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // TODO: Return state with hasError: true and error
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: Log error to console (or send to error tracking service)
  }

  render() {
    if (this.state.hasError) {
      // TODO: Render fallback UI
      // Show friendly error message
      // Add refresh button
      // Show error details in development mode only
      return this.props.fallback || (
        // ... default error UI
      );
    }

    return this.props.children;
  }
}
```

### 3. Create Toast Notification System

Create `src/components/Toast.tsx`:

```tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    // TODO: Generate random id

    // TODO: Add toast to array

    // TODO: Auto-dismiss after 5 seconds with setTimeout
  }, []);

  const dismissToast = useCallback((id: string) => {
    // TODO: Remove toast from array
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  // TODO: Get context and throw error if outside provider
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  // TODO: Render toasts in fixed bottom-right position
  // Different colors for each type (green for success, red for error, etc.)
  // Include dismiss button
}
```

### 4. Add Retry Logic to API Client

Update `src/api/client.ts`:

```typescript
async function fetchWithRetry<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 3
): Promise<T> {
  // TODO: Implement retry loop
  // Try up to 'retries' times
  // Don't retry client errors (4xx status codes)
  // Wait before retrying (exponential backoff: 1s, 2s, 4s)
  // HINT: Use setTimeout wrapped in Promise for delays
}

function getErrorMessage(error: unknown): string {
  // TODO: Convert errors to user-friendly messages
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please log in to continue.';
      case 404:
        return 'The requested item was not found.';
      case 500:
        return 'Server error. Please try again later.';
      // ... more cases
    }
  }

  // TODO: Handle network errors (Failed to fetch)

  return 'An unexpected error occurred. Please try again.';
}

export { getErrorMessage };
```

### 5. Add Offline Detection

Create `src/hooks/useOnlineStatus.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  // TODO: Track navigator.onLine state

  // TODO: Listen to 'online' and 'offline' events

  // TODO: Clean up event listeners

  // TODO: Return isOnline boolean
}
```

### 6. Create Offline Banner

Create `src/components/OfflineBanner.tsx`:

```tsx
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  // TODO: Return null if online

  // TODO: Show banner at top of screen when offline
  // "You are offline. Changes will be saved when you reconnect."
}
```

### 7. Integrate Error Handling

Update your App component:

```tsx
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { OfflineBanner } from './components/OfflineBanner';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <OfflineBanner />
        <BoardProvider boardId="...">
          <Board />
        </BoardProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
```

### 8. Use Toast for API Errors

```tsx
// In your components
const { showToast } = useToast();

const handleDelete = async () => {
  try {
    await deleteTask(taskId);
    showToast('success', 'Task deleted successfully');
  } catch (err) {
    showToast('error', getErrorMessage(err));
  }
};
```

### 9. Submit Your PR

```bash
git add .
git commit -m "feat: add comprehensive error handling"
git push -u origin task-3.4-error-handling
```

## Acceptance Criteria

- [ ] ErrorBoundary catches and displays React errors
- [ ] Toast notifications for success/error/warning
- [ ] Retry logic for server errors (5xx) with exponential backoff
- [ ] Human-readable error messages
- [ ] Offline detection and banner
- [ ] Toasts auto-dismiss after 5 seconds
- [ ] No cryptic error messages shown to users

## Tips

- Keep error messages helpful and actionable
- Log errors for debugging but show friendly messages to users
- Use exponential backoff for retries (1s, 2s, 4s)
- Don't retry client errors (400-499) - they won't succeed

## Key Concepts

**Error Boundary:** Catches React rendering errors
**Exponential Backoff:** Wait longer between each retry (1s, 2s, 4s, 8s)
**Graceful Degradation:** App continues working even with errors

---

**Previous Task:** [Task 3.3: Connect Frontend to API](../task-3.3/INSTRUCTIONS.md)
**Next Task:** [Task 3.5: Implement User Authentication](../task-3.5/INSTRUCTIONS.md)
