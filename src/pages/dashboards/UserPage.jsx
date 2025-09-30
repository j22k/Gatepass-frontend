import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash2, Users, Search, Eye } from 'lucide-react' // Add Eye icon
import { userService } from '../../services/userService'
import { warehouseService } from '../../services/warehouseService'
import { roleService } from '../../services/roleService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Confirm from '../../components/common/Confirm' // Add import for custom Confirm

const UserPage = () => {
  const [users, setUsers] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('') // Add search state
  const [confirmOpen, setConfirmOpen] = useState(false) // Add state for confirm dialog
  const [confirmMessage, setConfirmMessage] = useState('') // Add state for confirm message
  const [confirmAction, setConfirmAction] = useState(null) // Add state for confirm action callback
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    fetchUsers()
    fetchWarehouses()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers()
      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        console.error('Fetched data is not an array:', data)
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchWarehouses = async () => {
    try {
      const data = await warehouseService.getAllWarehouses()
      if (Array.isArray(data)) {
        setWarehouses(data)
      } else {
        setWarehouses([])
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      setWarehouses([])
    }
  }

  const fetchRoles = async () => {
    try {
      const data = await roleService.getAllRoles()
      if (Array.isArray(data)) {
        setRoles(data)
      } else {
        setRoles([])
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      setRoles([])
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, data)
      } else {
        await userService.createUser(data)
      }
      fetchUsers()
      setModalOpen(false)
      reset()
      setEditingUser(null)
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    reset({
      ...user,
      isActive: user.isActive !== undefined ? user.isActive : true // Default to true if not set
    })
    setModalOpen(true)
  }

  const handleDisable = async (id) => {
    setConfirmMessage('Are you sure you want to disable this user?')
    setConfirmAction(() => async () => {
      try {
        await userService.disableUser(id)
        fetchUsers()
      } catch (error) {
        console.error('Error disabling user:', error)
      }
    })
    setConfirmOpen(true)
  }

  const handleEnable = async (id) => {
    setConfirmMessage('Are you sure you want to enable this user?')
    setConfirmAction(() => async () => {
      try {
        await userService.enableUser(id)
        fetchUsers()
      } catch (error) {
        console.error('Error enabling user:', error)
      }
    })
    setConfirmOpen(true)
  }

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout title="Users">
      <div className="py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
        
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Warehouse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.warehouseName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          {user.isActive ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisable(user.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Disable
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEnable(user.id)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Enable
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
      </div>

      {/* Modal for adding/editing user */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 sm:mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? 'Edit User' : 'Add User'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter full name"
                {...register('name', { required: 'Full Name is required' })}
                error={errors.name?.message}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                {...register('email', { required: 'Email Address is required' })}
                error={errors.email?.message}
              />
              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                {...register('phone', { required: 'Phone Number is required' })}
                error={errors.phone?.message}
              />
              <Input
                label="Designation"
                placeholder="Enter designation"
                {...register('designation', { required: 'Designation is required' })}
                error={errors.designation?.message}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                {...register('password', { required: !editingUser ? 'Password is required' : false })}
                error={errors.password?.message}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Warehouse</label>
                <select
                  {...register('warehouseId', { required: 'Assigned Warehouse is required' })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Assigned Warehouse</option>
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>{wh.name}</option>
                  ))}
                </select>
                {errors.warehouseId && <p className="mt-1 text-sm text-red-600">{errors.warehouseId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                <select
                  {...register('role', { required: 'User Role is required' })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select User Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
              </div>
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  {...register('isActive')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
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
    </DashboardLayout>
  )
}

export default UserPage