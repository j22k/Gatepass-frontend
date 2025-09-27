import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password
    })
    return response.data
  },

  verifyToken: async (token) => {
    const response = await api.get('/api/auth/verify', {
      headers: { Authorization: token }
    })
    return response.data.user
  },

  logout: async () => {
    await api.post('/api/auth/logout')
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/profile')
    return response.data.data.user
  }
}