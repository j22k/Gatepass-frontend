import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Public API instance for visitor endpoints (no auth required)
const publicApi = axios.create({
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

export const warehouseService = {
  // Protected routes (requires auth)
  getAllWarehouses: async () => {
    const response = await api.get('/api/warehouse/getall')
    return response.data.data
  },

  getWarehouseById: async (id) => {
    const response = await api.get(`/api/warehouse/${id}`)
    return response.data.data
  },

  createWarehouse: async (data) => {
    const response = await api.post('/api/warehouse/create', data)
    return response.data.data
  },

  updateWarehouse: async (id, data) => {
    const response = await api.put(`/api/warehouse/${id}`, data)
    return response.data.data
  },

  deleteWarehouse: async (id) => {
    const response = await api.delete(`/api/warehouse/${id}`)
    return response.data
  },

  // Public routes (no auth required)
  getPublicWarehouses: async () => {
    const response = await publicApi.get('/api/warehouse/getall')
    return response.data.data
  },

  // New method for workflows
  getWorkflowsByWarehouse: async (warehouseId) => {
    const response = await api.get(`/api/warehouse-workflow/${warehouseId}`)
    console.log(response.data); // Updated to log response.data
    
    return response.data // Updated to return response.data directly
  },

  createWorkflow: async (data) => {
    const response = await api.post('/api/warehouse-workflow', data)
    return response.data.data
  },

  updateWorkflow: async (id, data) => {
    const response = await api.put(`/api/warehouse-workflow/${id}`, data)
    return response.data.data
  },

  deleteWorkflow: async (id) => {
    const response = await api.delete(`/api/warehouse-workflow/${id}`)
    return response.data
  }
}
