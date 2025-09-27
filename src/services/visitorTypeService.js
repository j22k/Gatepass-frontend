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

// Public API instance for visitors endpoints (no auth required)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const visitorTypeService = {
  // Protected routes (requires auth)
  getAllVisitorTypes: async () => {
    const response = await api.get('/api/visitortypes/getall')
    return response.data.data
  },

  getVisitorTypeById: async (id) => {
    const response = await api.get(`/api/visitortypes/${id}`)
    return response.data.data
  },

  createVisitorType: async (data) => {
    const response = await api.post('/api/visitortypes/create', data)
    return response.data.data
  },

  updateVisitorType: async (id, data) => {
    const response = await api.put(`/api/visitortypes/${id}`, data)
    return response.data.data
  },

  deleteVisitorType: async (id) => {
    const response = await api.delete(`/api/visitortypes/${id}`)
    return response.data
  },

  // Public routes (no auth required)
  getPublicVisitorTypes: async () => {
    const response = await publicApi.get('/api/visitortypes/getall')
    return response.data.data
  },

  createVisitor: async (data) => {
    const response = await publicApi.post('/api/visitors/create', data)
    return response.data.data
  }
}
