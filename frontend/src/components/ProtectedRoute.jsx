import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

const ProtectedRoute = () => {
  const { accessToken, refreshToken } = useAuthStore()

  if (!accessToken && !refreshToken) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
