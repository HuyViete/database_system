import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Collapse,
  IconButton
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  TableChart as TemplateIcon,
  Home as HomeIcon,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Person as PersonIcon,
  Add as AddIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { useBoardStore } from '../stores/useBoardStore'

function Sidebar() {
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true)
  const { workspace } = useBoardStore()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <Box sx={{ width: 260, p: 2, display: { xs: 'none', md: 'block' } }}>
      <List dense>
        <ListItemButton 
          onClick={() => navigate('/dashboard')}
          sx={{ 
            borderRadius: 1, 
            mb: 0.5, 
            color: isActive('/dashboard') ? 'primary.main' : 'text.secondary', 
            bgcolor: isActive('/dashboard') ? 'trello.navItemBg' : 'transparent' 
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}><DashboardIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Boards" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, mb: 0.5, color: 'text.secondary' }}>
          <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}><TemplateIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Templates" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, mb: 0.5, color: 'text.secondary' }}>
          <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}><HomeIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 1.5, borderColor: 'divider' }} />

      <Box sx={{ px: 1.5, pb: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Workspaces</Typography>
      </Box>

      <ListItemButton onClick={() => setWorkspaceExpanded(!workspaceExpanded)} sx={{ borderRadius: 1, color: 'text.secondary' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <Box sx={{ 
            width: 24, 
            height: 24, 
            background: 'linear-gradient(135deg, #4bbf6b 0%, #2f9e4f 100%)', 
            borderRadius: '4px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.8rem'
          }}>
            {workspace?.name?.[0]?.toUpperCase() || 'T'}
          </Box>
          <Typography sx={{ flexGrow: 1, fontWeight: 500, fontSize: '0.9rem' }}>{workspace?.name || 'Trello Workspace'}</Typography>
          {workspaceExpanded ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
        </Box>
      </ListItemButton>

      <Collapse in={workspaceExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          <ListItemButton 
            onClick={() => navigate('/dashboard')}
            sx={{ 
              pl: 5, 
              borderRadius: 1, 
              color: isActive('/dashboard') ? 'primary.main' : 'text.secondary', 
              bgcolor: isActive('/dashboard') ? 'trello.navItemBg' : 'transparent',
              mt: 0.5 
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}><DashboardIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Boards" />
          </ListItemButton>
          <ListItemButton 
            onClick={() => navigate('/members')}
            sx={{ 
              pl: 5, 
              borderRadius: 1, 
              color: isActive('/members') ? 'primary.main' : 'text.secondary',
              bgcolor: isActive('/members') ? 'trello.navItemBg' : 'transparent'
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}><PersonIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Members" />
            <IconButton size="small" sx={{ ml: 'auto', p: 0.5 }}><AddIcon fontSize="small" sx={{ width: 16, height: 16 }} /></IconButton>
          </ListItemButton>
          <ListItemButton sx={{ pl: 5, borderRadius: 1, color: 'text.secondary' }}>
            <ListItemIcon sx={{ minWidth: 28, color: 'text.secondary' }}><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Collapse>
    </Box>
  )
}

export default Sidebar
