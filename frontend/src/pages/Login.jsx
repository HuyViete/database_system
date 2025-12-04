import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Tab,
  Tabs,
  Alert,
  Divider
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard' // Placeholder for Trello logo
import axios from 'axios'
import ModeSwitcher from '../components/ModeSwitcher'

function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [tab, setTab] = useState(0)
  const [error, setError] = useState('')
  
  // Member State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Monitor State
  const [monitorToken, setMonitorToken] = useState('')

  const handleTabChange = (event, newValue) => {
    setTab(newValue)
    setError('')
  }

  const handleMemberLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { email, password })
      setAuth(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  const handleMonitorLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5001/api/auth/monitor-login', { token: monitorToken })
      setAuth(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid token')
    }
  }

  const handleCreateMonitor = async () => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/monitor-login', {})
      setAuth(res.data.user, res.data.token)
      alert(`Your Monitor Token is: ${res.data.monitorToken}. Save this to login later!`)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create monitor')
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <ModeSwitcher />
      </Box>
      {/* Background Illustrations (CSS Shapes) */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '400px',
        height: '400px',
        backgroundImage: 'url("https://trello.com/assets/d947df93bc055849898e.svg")', // Trello left illustration
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom left',
        backgroundSize: 'contain',
        zIndex: 0,
        display: { xs: 'none', md: 'block' }
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '400px',
        height: '400px',
        backgroundImage: 'url("https://trello.com/assets/241579c21b1d636726a4.svg")', // Trello right illustration
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom right',
        backgroundSize: 'contain',
        zIndex: 0,
        display: { xs: 'none', md: 'block' }
      }} />

      <Container component="main" maxWidth="xs" sx={{ zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <DashboardIcon sx={{ color: 'primary.main', fontSize: 40, mr: 1 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '2.5rem', letterSpacing: '-1px' }}>
            Brello
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '3px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <Typography component="h1" variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600, fontSize: '1rem' }}>
            Log in to continue
          </Typography>
          
          <Tabs 
            value={tab} 
            onChange={handleTabChange} 
            sx={{ mb: 3, width: '100%', borderBottom: 1, borderColor: 'divider' }} 
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Member" sx={{ fontWeight: 600, textTransform: 'none' }} />
            <Tab label="Monitor" sx={{ fontWeight: 600, textTransform: 'none' }} />
          </Tabs>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          {tab === 0 ? (
            <Box component="form" onSubmit={handleMemberLogin} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.2, fontSize: '0.9rem', fontWeight: 'bold' }}
              >
                Continue
              </Button>
              
              <Divider sx={{ my: 3, color: 'text.secondary', fontSize: '0.875rem' }}>OR</Divider>
              
              <Box sx={{ textAlign: 'center' }}>
                <Link to="/signup" style={{ textDecoration: 'none', color: 'var(--mui-palette-primary-main)', fontSize: '0.875rem' }}>
                  Can't log in? • Create an account
                </Link>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleMonitorLogin} sx={{ mt: 1, width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', textAlign: 'center' }}>
                Enter your access token to view boards as a Monitor.
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Monitor Token"
                value={monitorToken}
                onChange={(e) => setMonitorToken(e.target.value)}
                placeholder="Enter token"
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.2, fontSize: '0.9rem', fontWeight: 'bold' }}
              >
                Access
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCreateMonitor}
                sx={{ mt: 2, py: 1, fontSize: '0.9rem' }}
              >
                Generate New Monitor Access
              </Button>
            </Box>
          )}
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
           <Typography variant="caption" color="text.secondary">
             Brello • A Database System Project
           </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Login
