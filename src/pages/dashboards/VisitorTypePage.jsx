import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash2, FileText } from 'lucide-react'
import { visitorTypeService } from '../../services/visitorTypeService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const VisitorTypePage = () => {
  const [visitorTypes, setVisitorTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVisitorType, setEditingVisitorType] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    fetchVisitorTypes()
  }, [])

  const fetchVisitorTypes = async () => {
    try {
      const data = await visitorTypeService.getAllVisitorTypes()
      if (Array.isArray(data)) {
        setVisitorTypes(data)
      } else {
        console.error('Fetched data is not an array:', data)
        setVisitorTypes([])
      }
    } catch (error) {
      console.error('Error fetching visitor types:', error)
      setVisitorTypes([])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingVisitorType) {
        await visitorTypeService.updateVisitorType(editingVisitorType.id, data)
      } else {
        await visitorTypeService.createVisitorType(data)
      }
      fetchVisitorTypes()
      setModalOpen(false)
      reset()
      setEditingVisitorType(null)
    } catch (error) {
      console.error('Error saving visitor type:', error)
    }
  }

  const handleEdit = (visitorType) => {
    setEditingVisitorType(visitorType)
    reset(visitorType)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this visitor type?')) {
      try {
        await visitorTypeService.deleteVisitorType(id)
        fetchVisitorTypes()
      } catch (error) {
        console.error('Error deleting visitor type:', error)
      }
    }
  }

  const openCreateModal = () => {
    setEditingVisitorType(null)
    reset()
    setModalOpen(true)
  }

  return (
    <DashboardLayout title="Visitor Types">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Manage Visitor Types</h2>
          <Button onClick={openCreateModal} className="bg-primary-600 hover:bg-primary-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Visitor Type
          </Button>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(visitorTypes) && visitorTypes.map((visitorType) => (
                    <tr key={visitorType.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-6 h-6 text-primary-600 mr-3" />
                          <div className="text-sm font-medium text-gray-900">{visitorType.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(visitorType)}
                            className="text-primary-600 border-primary-600 hover:bg-primary-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(visitorType.id)}
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
        )}

        {/* Modal for Create/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingVisitorType ? 'Edit Visitor Type' : 'Add New Visitor Type'}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Visitor Type Name"
                    placeholder="Enter visitor type name"
                    {...register('name', { required: 'Visitor Type Name is required' })}
                    error={errors.name?.message}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white">
                      {editingVisitorType ? 'Update' : 'Create'}
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

export default VisitorTypePage
