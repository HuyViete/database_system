import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useBoardStore } from '../stores/useBoardStore'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddIcon from '@mui/icons-material/Add'

function Dashboard() {
  const navigate = useNavigate()
  const { user, accessToken, signOut } = useAuthStore()
  const { boards, fetchBoards, createBoard } = useBoardStore()
  const [openNewBoard, setOpenNewBoard] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')

  useEffect(() => {
    // ProtectedRoute handles the redirect, but we can double check
    // or just rely on the API call failing if token is invalid
    fetchBoards()
  }, [fetchBoards])

  const handleCreateBoard = async () => {
    try {
      const newBoard = await createBoard({ name: newBoardName, background_color: '#0079bf' })
      setOpenNewBoard(false)
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: 'trello.appBar' }}>
        <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            sx={{ display: 'flex', alignItems: 'center', color: 'white' }}
            onClick={() => navigate('/')}>
            <DashboardIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Brello
            </Typography>
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout} size="small">Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <DashboardIcon sx={{ mr: 1, color: 'trello.icon' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'trello.textMain' }}>
            Your Boards
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {boards.map((board) => (
            <Grid item xs={12} sm={6} md={3} key={board.board_id}>
              <Paper
                sx={{
                  height: '100px',
                  p: 2,
                  bgcolor: board.background_color || 'trello.boardBg',
                  color: 'white',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'filter 0.2s',
                  '&:hover': {
                    filter: 'brightness(0.9)'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onClick={() => navigate(`/board/${board.board_id}`)}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {board.name}
                </Typography>
              </Paper>
            </Grid>
          ))}

          {/* Create New Board Button */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                height: '100px',
                p: 2,
                bgcolor: 'trello.listBg',
                color: 'trello.textMain',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => setOpenNewBoard(true)}
            >
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <AddIcon sx={{ mr: 0.5 }} /> Create new board
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Create Board Dialog */}
      <Dialog open={openNewBoard} onClose={() => setOpenNewBoard(false)}>
        <DialogTitle>Create Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Board Title"
            fullWidth
            variant="outlined"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewBoard(false)}>Cancel</Button>
          <Button onClick={handleCreateBoard} variant="contained" disabled={!newBoardName}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Dashboard
