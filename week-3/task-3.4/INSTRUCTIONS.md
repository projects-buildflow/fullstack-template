# Task 3.4: Add Error Handling

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 50 XP | 45 min | Pull Request |

## Quick Links

- [Discord #ask-marcus](https://discord.com/channels/taskmaster/ask-marcus) - Get help
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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We hit an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-6 p-4 bg-red-50 text-red-700 text-left text-sm rounded overflow-auto max-w-lg">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
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

interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  const typeStyles: Record<ToastType, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${typeStyles[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}
        >
          <span className="text-lg">{icons[toast.type]}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
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
  let lastError: Error;

  for (let i = 0; i < retries; i++) {
    try {
      return await fetchApi<T>(endpoint, options);
    } catch (err) {
      lastError = err as Error;

      // Don't retry client errors (4xx)
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        throw err;
      }

      // Wait before retrying (exponential backoff)
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }

  throw lastError!;
}

// Human-readable error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return error.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested item was not found.';
      case 429:
        return 'Too many requests. Please wait a moment.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'Unable to connect to server. Please check your internet connection.';
  }

  return 'An unexpected error occurred. Please try again.';
}

export { getErrorMessage };
```

### 5. Add Offline Detection

Create `src/hooks/useOnlineStatus.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

### 6. Create Offline Banner

Create `src/components/OfflineBanner.tsx`:

```tsx
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 text-center py-2 z-50">
      You are offline. Changes will be saved when you reconnect.
    </div>
  );
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
- [ ] Retry logic for server errors (5xx)
- [ ] Human-readable error messages
- [ ] Offline detection and banner
- [ ] Toasts auto-dismiss after 5 seconds

## Tips

- Keep error messages helpful and actionable
- Log errors for debugging but show friendly messages to users
- Use exponential backoff for retries

---

**Previous Task:** [Task 3.3: Connect Frontend to API](../task-3.3/INSTRUCTIONS.md)
**Next Task:** [Task 3.5: Implement User Authentication](../task-3.5/INSTRUCTIONS.md)
