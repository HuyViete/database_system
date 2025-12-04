import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useBoardStore } from '../stores/useBoardStore'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import List from '../components/List'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import PeopleIcon from '@mui/icons-material/People'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

function Board() {
  const { id } = useParams()
  const navigate = useNavigate()
  // const {  }
  const { currentBoard: board, loading, error, fetchBoard } = useBoardStore()

  useEffect(() => {
    fetchBoard(id)
  }, [id, fetchBoard])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'trello.boardBg' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default', color: 'white' }}>
        <Typography variant="h5" sx={{ color: 'trello.textMain' }}>{error === 'Request failed with status code 403' ? 'Unauthorized Access' : error}</Typography>
        <Button 
          onClick={() => navigate('/')}
          variant='contained'>Return ?</Button>
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
          backgroundColor: 'trello.boardHeaderBg',
          color: 'common.white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', '&:hover': { backgroundColor: 'trello.boardButtonHover', borderRadius: 1, px: 1 } }}>
            {board.name}
          </Typography>
          <Button startIcon={<StarBorderIcon />} sx={{ color: 'common.white', minWidth: 'auto', px: 1, '&:hover': { backgroundColor: 'trello.boardButtonHover' } }} />
          <Box sx={{ height: '16px', width: '1px', backgroundColor: 'trello.boardButtonActive', mx: 1 }} />
          <Button startIcon={<PeopleIcon />} sx={{ color: 'common.white', textTransform: 'none', '&:hover': { backgroundColor: 'trello.boardButtonHover' } }}>
            {board.visibility || 'Workspace Visible'}
          </Button>
          <Button sx={{ color: 'common.white', textTransform: 'none', backgroundColor: 'trello.boardButtonHover', '&:hover': { backgroundColor: 'trello.boardButtonActive' } }}>
            Board
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            onClick={() => navigate('/dashboard')}
            sx={{ color: 'common.white', '&:hover': { backgroundColor: 'trello.boardButtonHover' } }}>
            Back to boards
          </Button>
          <Button startIcon={<FilterListIcon />} sx={{ color: 'common.white', textTransform: 'none', '&:hover': { backgroundColor: 'trello.boardButtonHover' } }}>
            Filter
          </Button>
          <Button startIcon={<MoreHorizIcon />} sx={{ color: 'common.white', textTransform: 'none', '&:hover': { backgroundColor: 'trello.boardButtonHover' } }}>
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
            backgroundColor: 'trello.scrollTrack',
            borderRadius: '10px',
            margin: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'trello.scrollThumb',
            borderRadius: '10px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'trello.scrollThumbHover'
          }
        }}
      >
        {board.lists && board.lists.map((list) => (
          <List key={list.list_id} listId={list.list_id} title={list.name} cards={list.cards} />
        ))}

        {/* Add List Button */}
        <Box
          sx={{
            minWidth: '272px',
            maxWidth: '272px',
            backgroundColor: 'trello.boardListAddBg',
            borderRadius: '12px',
            p: 1.5,
            color: 'common.white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'trello.boardListAddHover'
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
