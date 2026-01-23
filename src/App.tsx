function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TaskMaster
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your Kanban board application is ready to be built!
          </p>

          {/* Setup Status */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">Development Server Running</span>
            </div>
            <p className="text-gray-500 text-sm">
              Your environment is set up correctly. Run{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-indigo-600">
                npm run verify
              </code>{' '}
              to get your verification token.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-md p-6 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Next Steps
            </h2>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <span className="text-gray-600">
                  Run{' '}
                  <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                    npm run verify
                  </code>{' '}
                  in your terminal
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <span className="text-gray-600">
                  Copy the verification token (TASKMASTER-XXXX-XXXX)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <span className="text-gray-600">
                  Submit the token on the Tasks page to complete Task 1.1
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </span>
                <span className="text-gray-600">
                  Start building your Kanban board!
                </span>
              </li>
            </ol>
          </div>

          {/* Footer */}
          <p className="mt-8 text-gray-400 text-sm">
            TaskMaster Full-Stack Virtual Internship
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
