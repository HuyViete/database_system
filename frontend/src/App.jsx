import * as React from 'react'
import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Board from './pages/Board'
import Dashboard from './pages/Dashboard'

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Đang tải trang...
  </div>
)

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<Navigate to="/login" replace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/board/:id' element={<Board />} />
          
          {/* 
          <Route path='/help' element={<Help />} />
          <Route path='/about' element={<About />} />

          <Route element={<ProtectedRoute/>}>
          </Route> 
          */}

        </Routes>
      </Suspense>
    </Router>
  )
}