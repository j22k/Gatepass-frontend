import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor for token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/api/users/getall')
    return response.data.data
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`)
    return response.data.data
  },

  createUser: async (data) => {
    const response = await api.post('/api/users/create', data)
    return response.data.data
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/api/users/${id}`, data)
    return response.data.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`)
    return response.data
  },

  getUsersByWarehouseId: async (warehouseId) => {
    const response = await api.get(`/api/users/warehouse/${warehouseId}`)
    return response.data.data
  },

  // Disable a user
  disableUser: async (id) => {
    const response = await api.put(`/api/users/${id}/disable`)
    return response.data
  },

  // Enable a user
  enableUser: async (id) => {
    const response = await api.put(`/api/users/${id}/enable`)
    return response.data
  }
}
