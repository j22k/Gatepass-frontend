import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

const UnauthorizedPage = () => {
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Unauthorized Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You do not have permission to access this page.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage