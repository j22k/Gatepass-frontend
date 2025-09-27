import { useAuth } from '../../context/authContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { FileText, Clock, CheckCircle, Users } from 'lucide-react'

const ReceptionistDashboard = () => {
  const { user } = useAuth()

  const stats = [
    { name: 'Pending Requests', value: '12', icon: Clock, change: '+3%' },
    { name: 'Processed Today', value: '8', icon: CheckCircle, change: '+5%' },
    { name: 'Total Visitors', value: '45', icon: Users, change: '+2%' },
    { name: 'Active Sessions', value: '3', icon: FileText, change: '0%' },
  ]

  return (
    <DashboardLayout title="Receptionist Dashboard" user={user}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white overflow-hidden shadow rounded-lg border border-primary-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-primary-600" />
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
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Visitor Requests
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Welcome, {user.name}! Manage incoming visitor requests at reception.
            </p>
            {/* Placeholder for visitor request list - integrate with API when available */}
            <div className="mt-4 text-center text-gray-500">
              Visitor request management coming soon.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ReceptionistDashboard
