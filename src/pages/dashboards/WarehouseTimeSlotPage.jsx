import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash2, Clock, Search } from 'lucide-react' // Add Search icon
import { warehouseService } from '../../services/warehouseService'
import { warehouseTimeSlotService } from '../../services/warehouseTimeSlotService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Alert from '../../components/common/Alert' // Add import
import Confirm from '../../components/common/Confirm' // Add import for custom Confirm

const WarehouseTimeSlotPage = () => {
  const [warehouses, setWarehouses] = useState([])
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeSlotLoading, setTimeSlotLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTimeSlot, setEditingTimeSlot] = useState(null)
  const [submitError, setSubmitError] = useState('')
  const [searchTerm, setSearchTerm] = useState('') // Add search state
  const [alertMessage, setAlertMessage] = useState('') // Add state
  const [showAlert, setShowAlert] = useState(false) // Add state
  const [confirmOpen, setConfirmOpen] = useState(false) // Add state for confirm dialog
  const [confirmMessage, setConfirmMessage] = useState('') // Add state for confirm message
  const [confirmAction, setConfirmAction] = useState(null) // Add state for confirm action callback
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const data = await warehouseService.getAllWarehouses()
      setWarehouses(data || [])
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      setWarehouses([])
    } finally {
      setLoading(false)
    }
  }

  const handleWarehouseChange = async (warehouseId) => {
    setSelectedWarehouse(warehouseId)
    if (warehouseId) {
      setTimeSlotLoading(true)
      try {
        const data = await warehouseTimeSlotService.getTimeSlotsByWarehouseId(warehouseId)
        setTimeSlots(data || [])
      } catch (error) {
        console.error('Error fetching time slots:', error)
        setTimeSlots([])
      } finally {
        setTimeSlotLoading(false)
      }
    } else {
      setTimeSlots([])
    }
  }

  const onSubmit = async (data) => {
    setSubmitError('')
    try {
      if (editingTimeSlot) {
        await warehouseTimeSlotService.updateTimeSlot(editingTimeSlot.id, {
          name: data.name,
          from: data.from,
          to: data.to,
          warehouseId: selectedWarehouse
        })
      } else {
        await warehouseTimeSlotService.createTimeSlotByWarehouseId(selectedWarehouse, {
          name: data.name,
          from: data.from,
          to: data.to
        })
      }
      handleWarehouseChange(selectedWarehouse) // Refetch
      setModalOpen(false)
      reset()
      setEditingTimeSlot(null)
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'An error occurred while saving.')
    }
  }

  const handleEdit = (timeSlot) => {
    setEditingTimeSlot(timeSlot)
    reset({
      name: timeSlot.name,
      from: timeSlot.from,
      to: timeSlot.to
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    setConfirmMessage('Are you sure you want to delete this time slot?')
    setConfirmAction(() => async () => {
      try {
        await warehouseTimeSlotService.deleteTimeSlot(id)
        handleWarehouseChange(selectedWarehouse) // Refetch
      } catch (error) {
        setAlertMessage(error.response?.data?.message || 'Failed to delete time slot.') // Replace alert
        setShowAlert(true)
      }
    })
    setConfirmOpen(true)
  }

  const openCreateModal = () => {
    setEditingTimeSlot(null)
    reset()
    setModalOpen(true)
  }

  // Filter time slots based on search term
  const filteredTimeSlots = timeSlots.filter(slot =>
    slot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.to.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout title="Warehouse Time Slots">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Warehouse</label>
          <select
            value={selectedWarehouse}
            onChange={(e) => handleWarehouseChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a warehouse</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>{wh.name}</option>
            ))}
          </select>
        </div>

        {selectedWarehouse && (
          <>
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, from, or to..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Time Slots for Selected Warehouse</h3>
                  <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>
                {timeSlotLoading ? (
                  <div className="text-center py-8">Loading time slots...</div>
                ) : filteredTimeSlots.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTimeSlots.map((slot) => (
                          <tr key={slot.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                                <div className="text-sm font-medium text-gray-900">{slot.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot.from}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot.to}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(slot)}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(slot.id)}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No time slots found for this warehouse.</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Modal for Create/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingTimeSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
                </h3>
                {submitError && <p className="text-red-600 mb-4">{submitError}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Time Slot Name"
                    placeholder="Enter time slot name"
                    {...register('name', { required: 'Time Slot Name is required' })}
                    error={errors.name?.message}
                  />
                  <Input
                    label="From Time"
                    type="time"
                    {...register('from', { required: 'From Time is required' })}
                    error={errors.from?.message}
                  />
                  <Input
                    label="To Time"
                    type="time"
                    {...register('to', { required: 'To Time is required' })}
                    error={errors.to?.message}
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
                      {editingTimeSlot ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <Alert
          message={alertMessage}
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          type="error"
        />
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

export default WarehouseTimeSlotPage
