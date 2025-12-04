import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  Divider
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import axios from 'axios'
import ModeSwitcher from '../components/ModeSwitcher'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      await axios.post('http://localhost:5001/api/auth/signup', {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        birthDate: formData.birthDate
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
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
      {/* Background Illustrations */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '400px',
        height: '400px',
        backgroundImage: 'url("https://trello.com/assets/d947df93bc055849898e.svg")',
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
        backgroundImage: 'url("https://trello.com/assets/241579c21b1d636726a4.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom right',
        backgroundSize: 'contain',
        zIndex: 0,
        display: { xs: 'none', md: 'block' }
      }} />

      <Container component="main" maxWidth="sm" sx={{ zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <DashboardIcon sx={{ color: 'primary.main', fontSize: 40, mr: 1 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '2.5rem', letterSpacing: '-1px' }}>
            Brello
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '3px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <Typography component="h1" variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600, fontSize: '1rem' }}>
            Sign up for your account
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder="e.g. John"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder="e.g. Doe"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder="Choose a unique username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder="Enter your email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Birth Date"
                  name="birthDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder="Create a password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder="Confirm your password"
                />
              </Grid>
            </Grid>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3, mt: 2 }}>
              By signing up, you confirm that you've read and accepted our Terms of Service and Privacy Policy.
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ py: 1.2, fontSize: '0.9rem', fontWeight: 'bold' }}
            >
              Sign Up
            </Button>
            
            <Divider sx={{ my: 3, color: 'text.secondary', fontSize: '0.875rem' }}>OR</Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--mui-palette-primary-main)', fontSize: '0.875rem' }}>
                Already have an account? Log In
              </Link>
            </Box>
          </Box>
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

export default Signup
