import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import List from '../components/List'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import PeopleIcon from '@mui/icons-material/People'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import axios from 'axios'

function Board() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchBoard()
  }, [id, token])

  const fetchBoard = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBoard(res.data)
    } catch (err) {
      console.error(err)
      // Handle error (e.g. redirect to dashboard if 404 or 403)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'trello.boardBg' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    )
  }

  if (!board) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'trello.boardBg', color: 'white' }}>
        <Typography variant="h5">Board not found</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: board.background_color || 'trello.boardBg',
        backgroundImage: board.background_img ? `url(${board.background_img})` : 'linear-gradient(180deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.24) 48px, transparent 48px)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Board Header */}
      <Box
        sx={{
          height: 'auto',
          minHeight: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          gap: 2,
          flexWrap: 'wrap',
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0,0,0,0.15)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1, px: 1 } }}>
            {board.name}
          </Typography>
          <Button startIcon={<StarBorderIcon />} sx={{ color: 'white', minWidth: 'auto', px: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }} />
          <Box sx={{ height: '16px', width: '1px', backgroundColor: 'rgba(255,255,255,0.3)', mx: 1 }} />
          <Button startIcon={<PeopleIcon />} sx={{ color: 'white', textTransform: 'none', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>
            {board.visibility || 'Workspace Visible'}
          </Button>
          <Button sx={{ color: 'white', textTransform: 'none', backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}>
            Board
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button startIcon={<FilterListIcon />} sx={{ color: 'white', textTransform: 'none', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>
            Filter
          </Button>
          <Button startIcon={<MoreHorizIcon />} sx={{ color: 'white', textTransform: 'none', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>
            Show Menu
          </Button>
        </Box>
      </Box>

      {/* Board Canvas */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'flex-start',
          overflowX: 'auto',
          overflowY: 'hidden',
          p: 2,
          '&::-webkit-scrollbar': {
            height: '12px',
            width: '12px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.15)',
            borderRadius: '10px',
            margin: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.4)',
            borderRadius: '10px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(255,255,255,0.6)'
          }
        }}
      >
        {board.lists && board.lists.map((list) => (
          <List key={list.list_id} title={list.name} cards={list.cards} />
        ))}

        {/* Add List Button */}
        <Box
          sx={{
            minWidth: '272px',
            maxWidth: '272px',
            backgroundColor: 'rgba(255,255,255,0.24)',
            borderRadius: '12px',
            p: 1.5,
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.32)'
            }
          }}
        >
          <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>+ Add another list</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Board
