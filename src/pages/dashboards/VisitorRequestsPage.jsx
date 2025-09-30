import { useState, useEffect } from 'react'
import { visitorService } from '../../services/visitorService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Search } from 'lucide-react' // Add Search icon

const VisitorRequestsPage = () => {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('') // Add search state

  useEffect(() => {
    fetchVisitors()
  }, [])

  const fetchVisitors = async () => {
    try {
      const data = await visitorService.getAllVisitors()
      if (Array.isArray(data)) {
        setVisitors(data)
      } else {
        console.error('Fetched data is not an array:', data)
        setVisitors([])
      }
    } catch (error) {
      console.error('Error fetching visitors:', error)
      setVisitors([])
    } finally {
      setLoading(false)
    }
  }

  // Filter visitors based on search term
  const filteredVisitors = visitors.filter(visitor =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout title="Visitor Requests">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Manage Visitor Requests</h2>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accompanying Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accompanying Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accompanying Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(filteredVisitors) && filteredVisitors.map((visitor) => (
                    <tr key={visitor.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{visitor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(visitor.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.visitorTypeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.warehouseName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.timeSlotName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.from}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.to}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.accompanying.map(acc => acc.name).join(', ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.accompanying.map(acc => acc.phone).join(', ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.accompanying.map(acc => acc.email).join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default VisitorRequestsPage
