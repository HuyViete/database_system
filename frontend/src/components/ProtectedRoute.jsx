import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

const ProtectedRoute = () => {
  const { accessToken, refreshToken } = useAuthStore()
  
  // Check both store and localStorage to handle state update timing
  const token = accessToken || localStorage.getItem('accessToken')
  const refresh = refreshToken || localStorage.getItem('refreshToken')

  if (!token && !refresh) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
