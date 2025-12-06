import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useBoardStore } from '../stores/useBoardStore'
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  HelpOutline as HelpIcon,
  Apps as AppsIcon
} from '@mui/icons-material'
import ModeSwitcher from './ModeSwitcher'

function AppHeader() {
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()
  const { createBoard, isCreateBoardOpen, setCreateBoardOpen } = useBoardStore()
  const [newBoardName, setNewBoardName] = useState('')

  const handleCreateBoard = async () => {
    try {
      const newBoard = await createBoard({ name: newBoardName, background_color: '#0079bf' })
      setCreateBoardOpen(false)
      setNewBoardName('')
      navigate(`/board/${newBoard.board_id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'trello.appBar', borderBottom: '1px solid', borderColor: 'trello.border', boxShadow: 'none' }}>
        <Toolbar variant="dense" sx={{ minHeight: '48px !important', px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton size="small" sx={{ color: 'trello.appBarText' }}>
              <AppsIcon />
            </IconButton>
            <Box 
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
               {/* Trello Logo Placeholder */}
               <Box sx={{ bgcolor: 'trello.appBarText', height: 16, width: 16, borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ width: 6, height: 10, bgcolor: 'trello.appBar', borderRadius: '1px', mr: '2px' }} />
                  <Box sx={{ width: 6, height: 6, bgcolor: 'trello.appBar', borderRadius: '1px', mb: '4px' }} />
               </Box>
               <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'trello.appBarText', fontSize: '1.2rem' }}>Brello</Typography>
            </Box>
          </Box>

          {/* Center Search */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
             <TextField
                placeholder="Search"
                size="small"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'trello.textSecondary' }} />
                    </InputAdornment>
                  ),
                  sx: { 
                    color: 'trello.textSecondary', 
                    bgcolor: 'trello.inputBg', 
                    borderRadius: '4px',
                    height: '32px',
                    width: '500px',
                    '& fieldset': { borderColor: 'trello.inputBorder' },
                    '&:hover fieldset': { borderColor: 'trello.inputBorderHover' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                  }
                }}
             />
          </Box>

          {/* Right Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ color: 'trello.appBarText' }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton size="small" sx={{ color: 'trello.appBarText' }}>
              <HelpIcon />
            </IconButton>
            <ModeSwitcher sx={{ color: 'trello.appBarText' }} />
            <Avatar 
              sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: 'primary.main', color: 'primary.contrastText', cursor: 'pointer', ml: 2 }}
              onClick={handleLogout}
              title="Logout"
            >
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Create Board Dialog */}
      <Dialog open={isCreateBoardOpen} onClose={() => setCreateBoardOpen(false)}>
        <DialogTitle>Create Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Board Name"
            fullWidth
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateBoardOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateBoard} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AppHeader
