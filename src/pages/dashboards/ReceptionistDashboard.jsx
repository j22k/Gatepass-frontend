import { useState, useEffect } from 'react'
import { FileText, Clock, CheckCircle, Users, Search, Edit } from 'lucide-react' // Add Edit icon
import { useAuth } from '../../context/authContext'
import { visitorService } from '../../services/visitorService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Alert from '../../components/common/Alert' // Add import for Alert
import { useForm } from 'react-hook-form'

const ReceptionistDashboard = () => {
  const { user } = useAuth()
  const [visitorRequests, setVisitorRequests] = useState([])
  const [warehouseRequests, setWarehouseRequests] = useState([])
  const [todayRequests, setTodayRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [warehouseLoading, setWarehouseLoading] = useState(false)
  const [todayLoading, setTodayLoading] = useState(false)
  const [viewMode, setViewMode] = useState('today') // Default to 'today'
  const [searchTerm, setSearchTerm] = useState('') // Add search state
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [alertMessage, setAlertMessage] = useState('') // Add state for alert message
  const [showAlert, setShowAlert] = useState(false) // Add state for showing alert
  const [alertType, setAlertType] = useState('info') // Add state for alert type
  const { register: registerUpdate, handleSubmit: handleSubmitUpdate, reset: resetUpdate, formState: { errors: errorsUpdate } } = useForm()

  const stats = [
    { name: 'Pending Requests', value: '12', icon: Clock, change: '+3%' },
    { name: 'Processed Today', value: '8', icon: CheckCircle, change: '+5%' },
    { name: 'Total Visitors', value: '45', icon: Users, change: '+2%' },
    { name: 'Active Sessions', value: '3', icon: FileText, change: '0%' },
  ]

  useEffect(() => {
    fetchVisitorRequests()
    fetchTodayRequests() // Auto-fetch today's requests on load
  }, [])

  const fetchVisitorRequests = async () => {
    try {
      const data = await visitorService.getVisitorRequestsByUserId(user.id)
      if (Array.isArray(data)) {
        setVisitorRequests(data)
      } else {
        console.error('Fetched data is not an array:', data)
        setVisitorRequests([])
      }
    } catch (error) {
      console.error('Error fetching visitor requests:', error)
      setVisitorRequests([])
    } finally {
      setLoading(false)
    }
  }

  const fetchWarehouseRequests = async () => {
    setWarehouseLoading(true)
    try {
      const data = await visitorService.getAllVisitorRequestsByReceptionistWarehouse()
      if (Array.isArray(data)) {
        setWarehouseRequests(data)
      } else {
        console.error('Fetched data is not an array:', data)
        setWarehouseRequests([])
      }
    } catch (error) {
      console.error('Error fetching warehouse visitor requests:', error)
      setWarehouseRequests([])
    } finally {
      setWarehouseLoading(false)
    }
  }

  const fetchTodayRequests = async () => {
    setTodayLoading(true)
    try {
      const data = await visitorService.getTodayVisitorRequestsByReceptionistWarehouse()
      if (Array.isArray(data)) {
        setTodayRequests(data)
      } else {
        console.error('Fetched data is not an array:', data)
        setTodayRequests([])
      }
    } catch (error) {
      console.error('Error fetching today\'s visitor requests:', error)
      setTodayRequests([])
    } finally {
      setTodayLoading(false)
    }
  }

  const handleViewAll = () => {
    setViewMode('all')
    fetchWarehouseRequests()
  }

  const handleViewToday = () => {
    setViewMode('today')
    fetchTodayRequests()
  }

  const handleViewPersonal = () => {
    setViewMode('personal')
  }

  const handleUpdateStatus = (request) => {
    setSelectedRequest(request)
    resetUpdate({
      visitStatus: request.visitStatus || '',
      arrivedAt: request.arrivedAt || '',
      checkedOutAt: request.checkedOutAt || '',
      punctuality: request.punctuality || ''
    })
    setUpdateModalOpen(true)
  }

  const onUpdateSubmit = async (data) => {
    try {
      const response = await visitorService.updateVisitorStatusByReceptionist(selectedRequest.id, data)
      if (response.success === false) {
        setAlertMessage(response.message || 'Update failed.')
        setAlertType('error')
        setShowAlert(true)
      } else {
        setAlertMessage('Visitor status updated successfully!')
        setAlertType('success')
        setShowAlert(true)
        // Refresh current view
        if (viewMode === 'all') fetchWarehouseRequests()
        else if (viewMode === 'today') fetchTodayRequests()
        else fetchVisitorRequests()
        setUpdateModalOpen(false)
        setSelectedRequest(null)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      setAlertMessage(error.response?.data?.message || 'An error occurred while updating.')
      setAlertType('error')
      setShowAlert(true)
    }
  }

  // Filter requests based on search term
  const getFilteredRequests = () => {
    let requests = []
    if (viewMode === 'all') requests = warehouseRequests
    else if (viewMode === 'today') requests = todayRequests
    else requests = visitorRequests

    if (!searchTerm) return requests
    return requests.filter(request =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.visitorTypeName && request.visitorTypeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.trackingCode && request.trackingCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      new Date(request.date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Visitor Requests
              </h3>
              <div className="flex space-x-2">
                {viewMode !== 'all' && (
                  <Button onClick={handleViewAll} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get All
                  </Button>
                )}
                {viewMode !== 'today' && (
                  <Button onClick={handleViewToday} className="bg-green-600 hover:bg-green-700 text-white">
                    Show All Today's
                  </Button>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Welcome, {user.name}! Manage incoming visitor requests at reception.
            </p>
            
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, visitor type, tracking code, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {loading || warehouseLoading || todayLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Visitor Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Warehouse
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Time Slot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        Tracking Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        Visit Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        Punctuality
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        Arrived At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        Checked Out At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        Accompanying
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredRequests().map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {request.visitorTypeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          {request.warehouseName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {request.timeSlotName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {request.from}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {request.to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                          {request.trackingCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                          {request.visitStatus}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                          {request.punctuality}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                          {request.arrivedAt ? new Date(request.arrivedAt).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                          {request.checkedOutAt ? new Date(request.checkedOutAt).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                          {Array.isArray(request.accompanying) && request.accompanying.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {request.accompanying.map((person, index) => (
                                <li key={index}>{person.name} ({person.phone})</li>
                              ))}
                            </ul>
                          ) : (
                            'None'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(request)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Update Status
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {updateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Update Status for {selectedRequest?.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Update visit details for this approved request.
            </p>
            <form onSubmit={handleSubmitUpdate(onUpdateSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Status</label>
                <select
                  {...registerUpdate('visitStatus', { required: 'Visit Status is required' })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="visited">Visited</option>
                  <option value="no_show">No Show</option>
                </select>
                {errorsUpdate.visitStatus && <p className="mt-1 text-sm text-red-600">{errorsUpdate.visitStatus.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                
                <Input
                  label="Arrival Time"
                  type="time"
                  {...registerUpdate('arrivedAt')}
                  error={errorsUpdate.arrivedAt?.message}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Time</label>
                <Input
                  label="Check-Out Time"
                  type="time"
                  {...registerUpdate('checkedOutAt')}
                  error={errorsUpdate.checkedOutAt?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Punctuality</label>
                <select
                  {...registerUpdate('punctuality')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Punctuality</option>
                  <option value="on_time">On Time</option>
                  <option value="late">Late</option>
                </select>
                {errorsUpdate.punctuality && <p className="mt-1 text-sm text-red-600">{errorsUpdate.punctuality.message}</p>}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUpdateModalOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Alert
        message={alertMessage}
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        type={alertType}
      />
    </DashboardLayout>
  )
}

export default ReceptionistDashboard
