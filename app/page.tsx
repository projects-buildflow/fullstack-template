export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to TaskMaster
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your Kanban board for managing tasks efficiently.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 text-left">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Getting Started
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Run <code className="bg-gray-100 px-2 py-1 rounded">npm run verify</code> to complete Task 1.1</li>
            <li>Check your GitHub Issues for the next task</li>
            <li>Build components as instructed</li>
            <li>Submit PRs for review</li>
          </ol>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Need help? Check the Team Chat in your dashboard.
        </p>
      </div>
    </main>
  );
}
