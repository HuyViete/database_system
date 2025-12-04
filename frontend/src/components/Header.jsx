import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'

import { styled, alpha } from '@mui/material/styles'
import { useLocation, useNavigate } from 'react-router-dom'

import theme from '../theme'
import { useAuthStore } from '../stores/useAuthStore'
import { useAlertStore } from '../stores/useAlertStore'
import { useEffect } from 'react'
import ModeSwitcher from './ModeSwitcher'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.vars.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.vars.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}))

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuthStore()
  const { unreadCount, fetchAlerts, connectSocket } = useAlertStore()

  useEffect(() => {
    fetchAlerts()
    connectSocket()
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { label: 'Workspaces', path: '/workspaces' },
    { label: 'Boards', path: '/boards' },
    { label: 'Team', path: '/team' },
    { label: 'Profile', path: '/profile' }
  ]

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: theme.vars.palette.primary.header,
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              color: 'primary.main',
              mr: 2
            }}
          >
            Brello
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                fontSize: { xs: '0.75rem', sm: '1rem' },
                px: { xs: 1, sm: 2 },
                minWidth: 'auto'
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <IconButton
            size="large"
            aria-label={`show ${unreadCount} new notifications`}
            color="inherit"
            onClick={() => navigate('/notification')}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <ModeSwitcher />
          <Tooltip title="Logout">
            <IconButton
              size="large"
              color="inherit"
              onClick={handleLogout}
              sx={{ ml: 1 }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header