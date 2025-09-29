import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, FileText, Clock } from 'lucide-react'
import { useAuth } from '../../context/authContext'
import { visitorService } from '../../services/visitorService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/common/Button'

const ApproverDashboard = () => {
  const { user } = useAuth()
  const [pendingRequests, setPendingRequests] = useState([])
  const [approvedRequests, setApprovedRequests] = useState([])
  const [rejectedRequests, setRejectedRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')

  const stats = [
    { name: 'Pending Approvals', value: '15', icon: Clock, change: '+4%' },
    { name: 'Approved Today', value: '10', icon: CheckCircle, change: '+7%' },
    { name: 'Rejected Today', value: '2', icon: XCircle, change: '+1%' },
    { name: 'Total Requests', value: '120', icon: FileText, change: '+3%' },
  ]

  useEffect(() => {
    fetchAllRequests()
  }, [])

  const fetchAllRequests = async () => {
    try {
      const [pending, approved, rejected] = await Promise.all([
        visitorService.getPendingVisitorRequestsByUserId(user.id),
        visitorService.getApprovedVisitorRequestsByUserId(user.id),
        visitorService.getRejectedVisitorRequestsByUserId(user.id)
      ])
      setPendingRequests(pending || [])
      setApprovedRequests(approved || [])
      setRejectedRequests(rejected || [])
    } catch (error) {
      console.error('Error fetching visitor requests:', error)
      setPendingRequests([])
      setApprovedRequests([])
      setRejectedRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await visitorService.approveVisitorRequest(id)
      fetchAllRequests() // Refresh all lists
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  const handleReject = async (id) => {
    try {
      await visitorService.rejectVisitorRequest(id)
      fetchAllRequests() // Refresh all lists
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  const renderTable = (requests, showActions = false) => (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
            {showActions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.visitorTypeName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.warehouseName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.timeSlotName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.from}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.to}</td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(request.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <DashboardLayout title="Approver Dashboard" user={user}>
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
              Gate Pass Approvals
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Welcome, {user.name}! Review and approve/reject gate pass requests.
            </p>
            {/* Tabs */}
            <div className="mt-4 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pending ({pendingRequests.length})
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'approved'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Approved ({approvedRequests.length})
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'rejected'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Rejected ({rejectedRequests.length})
                </button>
              </nav>
            </div>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <>
                {activeTab === 'pending' && renderTable(pendingRequests, true)}
                {activeTab === 'approved' && renderTable(approvedRequests)}
                {activeTab === 'rejected' && renderTable(rejectedRequests)}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ApproverDashboard
