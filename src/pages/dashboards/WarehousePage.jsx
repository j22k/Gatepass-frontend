import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Eye, EyeOff, Warehouse, Search } from 'lucide-react' // Add Eye, EyeOff icons
import { warehouseService } from '../../services/warehouseService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Confirm from '../../components/common/Confirm' // Add import for custom Confirm

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('') // Add search state
  const [showDisabled, setShowDisabled] = useState(false) // Add state for showing disabled
  const [confirmOpen, setConfirmOpen] = useState(false) // Add state for confirm dialog
  const [confirmMessage, setConfirmMessage] = useState('') // Add state for confirm message
  const [confirmAction, setConfirmAction] = useState(null) // Add state for confirm action callback
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    fetchWarehouses()
  }, [showDisabled]) // Refetch when showDisabled changes

  const fetchWarehouses = async () => {
    setLoading(true)
    try {
      const data = showDisabled 
        ? await warehouseService.getAllDisabledWarehouses()
        : await warehouseService.getAllWarehouses()
      if (Array.isArray(data)) {
        setWarehouses(data)
      } else {
        console.error('Fetched data is not an array:', data)
        setWarehouses([])
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      setWarehouses([])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingWarehouse) {
        await warehouseService.updateWarehouse(editingWarehouse.id, data)
      } else {
        await warehouseService.createWarehouse(data)
      }
      fetchWarehouses()
      setModalOpen(false)
      reset()
      setEditingWarehouse(null)
    } catch (error) {
      console.error('Error saving warehouse:', error)
    }
  }

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse)
    reset(warehouse)
    setModalOpen(true)
  }

  const handleDisable = async (id) => {
    setConfirmMessage('Are you sure you want to disable this warehouse?')
    setConfirmAction(() => async () => {
      try {
        await warehouseService.disableWarehouse(id)
        fetchWarehouses()
      } catch (error) {
        console.error('Error disabling warehouse:', error)
      }
    })
    setConfirmOpen(true)
  }

  const handleEnable = async (id) => {
    setConfirmMessage('Are you sure you want to enable this warehouse?')
    setConfirmAction(() => async () => {
      try {
        await warehouseService.enableWarehouse(id)
        fetchWarehouses()
      } catch (error) {
        console.error('Error enabling warehouse:', error)
      }
    })
    setConfirmOpen(true)
  }

  const openCreateModal = () => {
    setEditingWarehouse(null)
    reset()
    setModalOpen(true)
  }

  // Filter warehouses based on search term
  const filteredWarehouses = warehouses.filter(wh =>
    wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout title="Warehouses">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Manage Warehouses</h2>
          <div className="flex space-x-2">
            <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Warehouse
            </Button>
            <Button 
              onClick={() => setShowDisabled(!showDisabled)} 
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200"
            >
              {showDisabled ? 'Show Active' : 'Show Disabled'}
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(filteredWarehouses) && filteredWarehouses.map((warehouse) => (
                    <tr key={warehouse.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Warehouse className="w-6 h-6 text-blue-600 mr-3" />
                          <div className="text-sm font-medium text-gray-900">{warehouse.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          warehouse.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {warehouse.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(warehouse)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {warehouse.isActive ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisable(warehouse.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <EyeOff className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEnable(warehouse.id)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Create/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Warehouse Name"
                    placeholder="Enter warehouse name"
                    {...register('name', { required: 'Warehouse Name is required' })}
                    error={errors.name?.message}
                  />
                  <Input
                    label="Warehouse Location"
                    placeholder="Enter warehouse location"
                    {...register('location', { required: 'Warehouse Location is required' })}
                    error={errors.location?.message}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      {editingWarehouse ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <Confirm
          message={confirmMessage}
          isOpen={confirmOpen}
          onConfirm={() => {
            if (confirmAction) confirmAction()
            setConfirmOpen(false)
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </DashboardLayout>
  )
}

export default WarehousePage
