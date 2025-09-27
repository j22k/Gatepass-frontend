import { Link } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  Warehouse,
} from 'lucide-react'

const AdminDashboard = () => {
  const { user } = useAuth()

  const stats = [
    { name: 'Total Passes', value: '456', icon: FileText, change: '+8%' },
    { name: 'Active Users', value: '89', icon: Users, change: '+3%' },
    { name: 'Pending Approvals', value: '12', icon: Clock, change: '+2%' },
    { name: 'Approved Today', value: '34', icon: CheckCircle, change: '+15%' },
  ]

  return (
    <DashboardLayout title="Admin Dashboard" user={user}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/warehouses"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-primary-200"
          >
            <Warehouse className="h-8 w-8 text-primary-600 mb-2" />
            <h4 className="text-lg font-medium text-gray-900">Warehouses</h4>
            <p className="text-sm text-gray-600">Manage warehouses</p>
          </Link>
          <Link
            to="/users"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-primary-200"
          >
            <Users className="h-8 w-8 text-primary-600 mb-2" />
            <h4 className="text-lg font-medium text-gray-900">Users</h4>
            <p className="text-sm text-gray-600">Manage users</p>
          </Link>
          <Link
            to="/visitor-types"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-primary-200"
          >
            <FileText className="h-8 w-8 text-primary-600 mb-2" />
            <h4 className="text-lg font-medium text-gray-900">Visitor Types</h4>
            <p className="text-sm text-gray-600">Manage visitor types</p>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Department Management
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {user.name}! Manage your department's gate passes and
              users.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard