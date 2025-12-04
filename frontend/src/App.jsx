import * as React from 'react'
import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Board from './pages/Board'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './stores/useAuthStore'

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Đang tải trang...
  </div>
)

const RootRedirect = () => {
  const { accessToken, refreshToken } = useAuthStore()
  const token = accessToken || localStorage.getItem('accessToken')
  const refresh = refreshToken || localStorage.getItem('refreshToken')
  const isAuthenticated = !!token || !!refresh
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<RootRedirect />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/board/:id' element={<Board />} />
          </Route>

        </Routes>
      </Suspense>
    </Router>
  )
}