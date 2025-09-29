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
  },

  // For approvers: get all visitor requests for approval
  getAllVisitorRequestsForApproval: async () => {
    const response = await api.get('/api/visitors/getall')
    console.log('Fetched visitor requests for approval:', response.data.data);
    
    return response.data.data
  },

  // Approve a visitor request
  approveVisitorRequest: async (id) => {
    const response = await api.put(`/api/visitors/${id}/approve`)
    return response.data
  },

  // Reject a visitor request
  rejectVisitorRequest: async (id) => {
    const response = await api.put(`/api/visitors/${id}/reject`)
    return response.data
  },

  // Get visitor requests by user ID (for Approver and Receptionist)
  getVisitorRequestsByUserId: async (userId) => {
    const response = await api.get(`/api/visitors/user/${userId}`)
    return response.data.data
  },

  // Get pending visitor requests by user ID
  getPendingVisitorRequestsByUserId: async (userId) => {
    const response = await api.get(`/api/visitors/user/${userId}/pending`)
    return response.data.data
  },

  // Get approved visitor requests by user ID
  getApprovedVisitorRequestsByUserId: async (userId) => {
    const response = await api.get(`/api/visitors/user/${userId}/approved`)
    return response.data.data
  },

  // Get rejected visitor requests by user ID
  getRejectedVisitorRequestsByUserId: async (userId) => {
    const response = await api.get(`/api/visitors/user/${userId}/rejected`)
    return response.data.data
  },
}
