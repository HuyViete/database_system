import axios from 'axios'
import { useAuthStore } from '../stores/useAuthStore'
import authService from '../services/authService'
import { toast } from 'sonner'

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api',
  withCredentials:true
})

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const { refreshToken, setAccessToken, signOut } = useAuthStore.getState()
        
        if (!refreshToken) {
          signOut()
          toast.error('Session expired. Please login again.')
          return Promise.reject(error)
        }

        const res = await authService.refreshToken(refreshToken)
        const newAccessToken = res.accessToken
        
        setAccessToken(newAccessToken)
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().signOut()
        toast.error('Session expired. Please login again.')
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api