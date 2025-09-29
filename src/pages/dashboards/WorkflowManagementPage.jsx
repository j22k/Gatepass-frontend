import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { warehouseService } from '../../services/warehouseService'
import { visitorTypeService } from '../../services/visitorTypeService'
import { userService } from '../../services/userService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const WorkflowManagementPage = () => {
  const [warehouses, setWarehouses] = useState([])
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [workflows, setWorkflows] = useState([])
  const [visitorTypes, setVisitorTypes] = useState([])
  const [users, setUsers] = useState([]) // This will be warehouse-specific users
  const [loading, setLoading] = useState(true)
  const [workflowLoading, setWorkflowLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStep, setEditingStep] = useState(null)
  const [submitError, setSubmitError] = useState('')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    fetchWarehouses()
    fetchVisitorTypes()
    fetchUsers()
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

  const fetchVisitorTypes = async () => {
    try {
      const data = await visitorTypeService.getAllVisitorTypes()
      setVisitorTypes(data || [])
    } catch (error) {
      console.error('Error fetching visitor types:', error)
      setVisitorTypes([])
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers()
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    }
  }

  const fetchUsersByWarehouse = async (warehouseId) => {
    try {
      const data = await userService.getUsersByWarehouseId(warehouseId)
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users by warehouse:', error)
      setUsers([])
    }
  }

  const handleWarehouseChange = async (warehouseId) => {
    setSelectedWarehouse(warehouseId)
    if (warehouseId) {
      setWorkflowLoading(true)
      try {
        const data = await warehouseService.getWorkflowsByWarehouse(warehouseId)
        setWorkflows(data || [])
        await fetchUsersByWarehouse(warehouseId) // Fetch users for this warehouse
      } catch (error) {
        console.error('Error fetching workflows:', error)
        setWorkflows([])
      } finally {
        setWorkflowLoading(false)
      }
    } else {
      setWorkflows([])
      setUsers([])
    }
  }

  const onSubmit = async (data) => {
    setSubmitError('')
    try {
      if (editingStep) {
        await warehouseService.updateWorkflow(editingStep.id, {
          step_no: parseInt(data.stepNo),
          approver: data.approver
        })
      } else {
        await warehouseService.createWorkflow({
          warehouse_id: selectedWarehouse,
          visitor_type_id: data.visitorTypeId,
          step_no: parseInt(data.stepNo),
          approver: data.approver
        })
      }
      handleWarehouseChange(selectedWarehouse) // Refetch
      setModalOpen(false)
      reset()
      setEditingStep(null)
    } catch (error) {
      setSubmitError(error.response?.data?.error || 'An error occurred while saving.')
    }
  }

  const handleEdit = (step) => {
    const approverUser = users.find(user => user.name === step.approver)
    setEditingStep(step)
    reset({
      stepNo: step.stepNo,
      approver: approverUser ? approverUser.id : ''
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workflow step?')) {
      try {
        await warehouseService.deleteWorkflow(id)
        handleWarehouseChange(selectedWarehouse) // Refetch
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete workflow step.')
      }
    }
  }

  const openCreateModal = () => {
    setEditingStep(null)
    reset()
    setModalOpen(true)
  }

  return (
    <DashboardLayout title="Workflow Management">
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
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Workflows for Selected Warehouse</h3>
                <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
              {workflowLoading ? (
                <div className="text-center py-8">Loading workflows...</div>
              ) : workflows.length > 0 ? (
                <div className="space-y-6">
                  {workflows.map((workflow, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">{workflow.visitorType}</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step No</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approver</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {workflow.steps.map((step) => (
                              <tr key={step.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{step.stepNo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{step.approver}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEdit(step)}
                                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDelete(step.id)}
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No workflows found for this warehouse.</div>
              )}
            </div>
          </div>
        )}

        {/* Modal for Create/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingStep ? 'Edit Workflow Step' : 'Add New Workflow Step'}
                </h3>
                {submitError && <p className="text-red-600 mb-4">{submitError}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {!editingStep && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Type</label>
                      <select
                        {...register('visitorTypeId', { required: 'Visitor Type is required' })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Visitor Type</option>
                        {visitorTypes.map((type) => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                      {errors.visitorTypeId && <p className="mt-1 text-sm text-red-600">{errors.visitorTypeId.message}</p>}
                    </div>
                  )}
                  <Input
                    label="Step Number"
                    type="number"
                    placeholder="Enter step number (positive integer)"
                    {...register('stepNo', { 
                      required: 'Step Number is required', 
                      min: { value: 1, message: 'Step Number must be at least 1' },
                      valueAsNumber: true
                    })}
                    error={errors.stepNo?.message}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approver</label>
                    <select
                      {...register('approver', { required: 'Approver is required' })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Approver</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                    {errors.approver && <p className="mt-1 text-sm text-red-600">{errors.approver.message}</p>}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      {editingStep ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default WorkflowManagementPage
