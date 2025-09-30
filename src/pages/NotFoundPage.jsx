import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <Home className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The page you're looking for doesn't exist.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
