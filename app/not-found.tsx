import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The page you're looking for doesn't exist
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">404 - Not Found</h3>
          <p className="text-sm text-gray-600 mb-4">
            The page you're looking for might have been moved, deleted, or doesn't exist.
          </p>
          <div className="flex space-x-2">
            <Link 
              href="/"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition-colors"
            >
              Go Home
            </Link>
            <Link 
              href="/login"
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded text-center hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
