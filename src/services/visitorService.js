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

export const visitorService = {
  // Protected routes (requires auth)
  getAllVisitors: async () => {
    const response = await api.get('/api/visitors/getall')
    return response.data.data
  },

  getVisitorById: async (id) => {
    const response = await api.get(`/api/visitors/${id}`)
    return response.data.data
  },

  createVisitor: async (data) => {
    const response = await api.post('/api/visitors/create', data)
    return response.data.data
  },

  updateVisitor: async (id, data) => {
    const response = await api.put(`/api/visitors/${id}`, data)
    return response.data.data
  },

  deleteVisitor: async (id) => {
    const response = await api.delete(`/api/visitors/${id}`)
    return response.data
  }
}
