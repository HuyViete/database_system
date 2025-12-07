import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBoardStore } from '../stores/useBoardStore'
import AppHeader from '../components/AppHeader'
import Sidebar from '../components/Sidebar'
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  TextField,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material'

function Dashboard() {
  const navigate = useNavigate()
  const { boards, fetchBoards, setCreateBoardOpen, workspace, fetchWorkspace, updateWorkspaceName } = useBoardStore()
  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    fetchBoards()
    fetchWorkspace()
  }, [fetchBoards, fetchWorkspace])

  const handleSaveWorkspaceName = async () => {
    if (!editingName.trim() || !workspace?.workspace_id) return
    try {
      await updateWorkspaceName(workspace.workspace_id, editingName)
      setIsEditingWorkspace(false)
    } catch (error) {
      console.error('Failed to update workspace name:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingName(workspace?.name || '')
    setIsEditingWorkspace(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.secondary' }}>
      <AppHeader />

      <Box sx={{ display: 'flex', height: 'calc(100vh - 48px)' }}>
        <Sidebar />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          {/* Workspace Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              background: 'linear-gradient(135deg, #4bbf6b 0%, #2f9e4f 100%)', 
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              T
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 40 }}>
                {isEditingWorkspace ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      size="small"
                      autoFocus
                      sx={{ 
                        '& .MuiInputBase-root': { 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold',
                          height: 40,
                          p: 0
                        },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'primary.main' },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '2px solid', borderColor: 'primary.main' }
                      }}
                    />
                    <IconButton size="small" onClick={handleSaveWorkspaceName} sx={{ color: 'success.main', bgcolor: 'success.light', '&:hover': { bgcolor: 'success.main', color: 'white' } }}>
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={handleCancelEdit} sx={{ color: 'error.main', bgcolor: 'error.light', '&:hover': { bgcolor: 'error.main', color: 'white' } }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{workspace?.name || 'Not Found'}</Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        setEditingName(workspace?.name || '')
                        setIsEditingWorkspace(true)
                      }} 
                      sx={{ color: 'text.secondary' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <LockIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Private</Typography>
                {workspace?.completion_percent !== undefined && (
                  <>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mx: 1 }}>•</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Completion: {Number(workspace.completion_percent).toFixed(0)}%
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'divider', mb: 4 }} />

          {/* Your Boards Section */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Your boards</Typography>
          </Box>

          <Grid container spacing={2}>
            {/* Existing Boards */}
            {boards.map((board) => (
              <Grid item xs={12} sm={6} md={3} key={board.board_id}>
                <Paper
                  onClick={() => navigate(`/board/${board.board_id}`)}
                  sx={{
                    height: '100px',
                    width: '202px',
                    p: 2,
                    background: board.background_color && board.background_color.startsWith('#') 
                      ? board.background_color 
                      : 'linear-gradient(to bottom right, #ff9966, #ff5e62)', 
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'filter 0.2s',
                    '&:hover': { filter: 'brightness(0.9)' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {board.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}

            {/* Create New Board Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                onClick={() => setCreateBoardOpen(true)}
                sx={{
                  height: '100px',
                  width: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'trello.createBoardBg',
                  color: 'text.secondary',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'trello.createBoardHover' }
                }}
              >
                <AddIcon></AddIcon>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
