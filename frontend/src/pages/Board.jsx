import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useBoardStore } from '../stores/useBoardStore'
import { Box, Typography, Button, CircularProgress, TextField } from '@mui/material'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import List from '../components/List'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import PeopleIcon from '@mui/icons-material/People'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function Board() {
  const { id } = useParams()
  const navigate = useNavigate()
  // const {  }
  const { currentBoard: board, loading, error, fetchBoard, updateBoard, createList, moveList, moveCard } = useBoardStore()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [boardTitle, setBoardTitle] = useState('')
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')

  useEffect(() => {
    fetchBoard(id)
  }, [id, fetchBoard])

  useEffect(() => {
    if (board) {
      setBoardTitle(board.name)
    }
  }, [board])

  const handleTitleUpdate = async () => {
    if (boardTitle !== board.name) {
      await updateBoard(board.board_id, boardTitle)
    }
    setIsEditingTitle(false)
  }

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return
    await createList(board.board_id, newListTitle)
    setNewListTitle('')
    setIsAddingList(false)
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Moving Lists
    if (type === 'list') {
      const newLists = [...board.lists]
      const [removed] = newLists.splice(source.index, 1)
      newLists.splice(destination.index, 0, removed)

      // Calculate new position
      let newPos
      if (destination.index === 0) {
        newPos = newLists[1] ? newLists[1].position - 1 : 0
      } else if (destination.index === newLists.length - 1) {
        newPos = newLists[newLists.length - 2].position + 1
      } else {
        newPos = (newLists[destination.index - 1].position + newLists[destination.index + 1].position) / 2
      }
      
      // Update local state immediately (optimistic)
      // We need to update the position in the moved item for subsequent moves to work correctly locally
      removed.position = newPos
      
      moveList(draggableId, newPos, newLists)
      return
    }

    // Moving Cards
    if (type === 'card') {
      const sourceList = board.lists.find(list => list.list_id === source.droppableId)
      const destList = board.lists.find(list => list.list_id === destination.droppableId)

      if (!sourceList || !destList) return

      // Move within same list
      if (source.droppableId === destination.droppableId) {
        const newCards = [...sourceList.cards]
        const [removed] = newCards.splice(source.index, 1)
        newCards.splice(destination.index, 0, removed)

        let newPos
        if (destination.index === 0) {
          newPos = newCards[1] ? newCards[1].position - 1 : 0
        } else if (destination.index === newCards.length - 1) {
          newPos = newCards[newCards.length - 2].position + 1
        } else {
          newPos = (newCards[destination.index - 1].position + newCards[destination.index + 1].position) / 2
        }

        removed.position = newPos

        const newLists = board.lists.map(list => {
          if (list.list_id === sourceList.list_id) {
            return { ...list, cards: newCards }
          }
          return list
        })

        moveCard(draggableId, destList.list_id, newPos, newLists)
      } else {
        // Move to different list
        const sourceCards = [...sourceList.cards]
        const [removed] = sourceCards.splice(source.index, 1)
        const destCards = [...destList.cards]
        destCards.splice(destination.index, 0, removed)

        let newPos
        if (destination.index === 0) {
          newPos = destCards[1] ? destCards[1].position - 1 : 0
        } else if (destination.index === destCards.length - 1) {
          newPos = destCards[destCards.length - 2] ? destCards[destCards.length - 2].position + 1 : 0
        } else {
          newPos = (destCards[destination.index - 1].position + destCards[destination.index + 1].position) / 2
        }

        removed.position = newPos

        const newLists = board.lists.map(list => {
          if (list.list_id === sourceList.list_id) {
            return { ...list, cards: sourceCards }
          }
          if (list.list_id === destList.list_id) {
            return { ...list, cards: destCards }
          }
          return list
        })

        moveCard(draggableId, destList.list_id, newPos, newLists)
      }
    }
  }

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

  if (!board) return null
    
      {/* Board Canvas */}
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'trello.boardBg' }}>
      {/* Board Bar */}
      <Box sx={{
        width: '100%',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: 'rgba(0,0,0,0.15)',
        minHeight: '48px'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            sx={{ color: 'white', minWidth: 'auto' }} 
            onClick={() => navigate('/')}
          >
            Back
          </Button>
          {isEditingTitle ? (
            <TextField
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              onBlur={handleTitleUpdate}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleUpdate()
              }}
              autoFocus
              size="small"
              sx={{
                '& .MuiInputBase-root': {
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }}
            />
          ) : (
            <Typography
              variant="h6"
              onClick={() => setIsEditingTitle(true)}
              sx={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: 'white',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px' },
                px: 1
              }}
            >
              {board.name}
            </Typography>
          )}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button startIcon={<StarBorderIcon />} sx={{ color: 'white' }}>
              Star
            </Button>
            <Button startIcon={<PeopleIcon />} sx={{ color: 'white' }}>
              Workspace Visible
            </Button>
            <Button startIcon={<FilterListIcon />} sx={{ color: 'white' }}>
              Filter
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<MoreHorizIcon />} sx={{ color: 'white' }}>
            Show Menu
          </Button>
        </Box>
      </Box>

      {/* Board Canvas */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="list">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
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
              {board.lists && board.lists.map((list, index) => (
                <List key={list.list_id} list={list} index={index} />
              ))}
              {provided.placeholder}

              {/* Add List Button */}
              <Box
                sx={{
                  minWidth: '272px',
                  maxWidth: '272px',
                  backgroundColor: isAddingList ? 'trello.listBg' : 'trello.boardListAddBg',
                  borderRadius: '12px',
                  p: 1.5,
                  color: isAddingList ? 'trello.textMain' : 'common.white',
                  height: 'fit-content',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                     backgroundColor: isAddingList ? 'trello.listBg' : 'rgba(255, 255, 255, 0.32)'
                  }
                }}
              >
                {isAddingList ? (
                  <Box>
                    <TextField
                      placeholder="Enter list title..."
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateList()
                      }}
                      autoFocus
                      fullWidth
                      size="small"
                      sx={{
                        mb: 1,
                        '& .MuiInputBase-root': {
                          backgroundColor: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': { border: '2px solid #0079bf' }
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        onClick={handleCreateList}
                        sx={{ 
                          textTransform: 'none',
                          backgroundColor: '#0079bf',
                          '&:hover': { backgroundColor: '#026aa7' }
                        }}
                      >
                        Add list
                      </Button>
                      <CloseIcon 
                        sx={{ cursor: 'pointer', color: 'trello.textMain', '&:hover': { color: 'trello.textSecondary' } }} 
                        onClick={() => setIsAddingList(false)}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box 
                    onClick={() => setIsAddingList(true)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', width: '100%' }}
                  >
                    <AddIcon />
                    <Typography sx={{ fontWeight: 500 }}>Add another list</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}

export default Board
