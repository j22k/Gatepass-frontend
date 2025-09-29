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

export const warehouseTimeSlotService = {
  // Protected routes (requires auth)
  getAllTimeSlots: async () => {
    const response = await api.get('/api/warehouse-time-slots/getall')
    return response.data.data
  },

  getTimeSlotById: async (id) => {
    const response = await api.get(`/api/warehouse-time-slots/${id}`)
    return response.data.data
  },

  createTimeSlot: async (data) => {
    const response = await api.post('/api/warehouse-time-slots/create', data)
    return response.data.data
  },

  // Get all warehouse time slots
  getAllTimeSlots: async () => {
    const response = await api.get('/api/warehouse-time-slots/getall')
    return response.data.data
  },

  // Get time slots by warehouse ID
  getTimeSlotsByWarehouseId: async (warehouseId) => {
    const response = await api.get(`/api/warehouse-time-slots/${warehouseId}`)
    return response.data.data
  },

  // Create time slot by warehouse ID
  createTimeSlotByWarehouseId: async (warehouseId, data) => {
    const response = await api.post(`/api/warehouse-time-slots/warehouse/${warehouseId}`, data)
    return response.data.data
  },

  updateTimeSlot: async (id, data) => {
    const response = await api.put(`/api/warehouse-time-slots/${id}`, data)
    return response.data.data
  },

  deleteTimeSlot: async (id) => {
    const response = await api.delete(`/api/warehouse-time-slots/${id}`)
    return response.data
  },

  // Public endpoint (no auth) - single slot by ID
  getTimeSlotPublicById: async (id) => {
    const response = await publicApi.get(`/api/warehouse-time-slots/${id}`)
    console.log(response.data.data);
    
    return response.data.data
  },

  // Public endpoint previously used (avoid calling this for public flows due to auth on backend)
  getAllTimeSlotsPublic: async () => {
    const response = await publicApi.get('/api/warehouse-time-slots/getall')
    return response.data.data
  },

  // Public endpoint for visitors to get time slots by warehouse (kept for compatibility)
  getTimeSlotsByWarehouse: async (warehouseId) => {
    try {
      // Fetch all time slots (using public API; assumes backend allows or add public endpoint if needed)
      const response = await publicApi.get('/api/warehouse-time-slots/getall')
      const { data } = response.data
      
      // Filter time slots for the selected warehouse
      const warehouseTimeSlots = Array.isArray(data) 
        ? data.filter(slot => slot.warehouseId === warehouseId)
        : []

      return warehouseTimeSlots
    } catch (error) {
      console.error('Error fetching time slots:', error)
      return []
    }
  }
}
