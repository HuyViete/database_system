import { useState } from 'react'
import { Box, Typography, IconButton, Button, TextField, Menu, MenuItem } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import Card from './Card'
import { useBoardStore } from '../stores/useBoardStore'
import { Droppable, Draggable } from '@hello-pangea/dnd'

function List({ list, index, onCardClick }) {
  const { list_id: listId, name: title, cards = [] } = list
  const [isAdding, setIsAdding] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [listTitle, setListTitle] = useState(title)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { createCard, updateList, deleteList } = useBoardStore()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteList = async () => {
    if (window.confirm('Are you sure you want to delete this list? All cards in it will be deleted.')) {
      await deleteList(listId)
    }
    handleClose()
  }

  const handleCreateCard = async () => {
    if (!newCardTitle.trim()) return
    await createCard(listId, newCardTitle)
    setNewCardTitle('')
    setIsAdding(false)
  }

  const handleTitleUpdate = async () => {
    if (listTitle !== title) {
      await updateList(listId, listTitle)
    }
    setIsEditingTitle(false)
  }

  return (
    <Draggable draggableId={listId} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            minWidth: '272px',
            maxWidth: '272px',
            backgroundColor: 'trello.listBg',
            borderRadius: '12px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '100%',
            marginRight: 2
          }}
        >
          {/* List Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
              pl: 1,
              pr: 0.5
            }}
          >
            {isEditingTitle ? (
              <TextField
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                onBlur={handleTitleUpdate}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleUpdate()
                }}
                autoFocus
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'trello.textMain',
                    backgroundColor: 'white',
                  },
                  '& .MuiOutlinedInput-notchedOutline': { border: '2px solid #0079bf' }
                }}
              />
            ) : (
              <Typography
                onClick={() => setIsEditingTitle(true)}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: 'trello.textMain',
                  cursor: 'pointer',
                  flexGrow: 1
                }}
              >
                {title}
              </Typography>
            )}
            <IconButton 
              size="small" 
              sx={{ borderRadius: 1, color: 'trello.textSecondary', '&:hover': { backgroundColor: 'action.hover' } }}
              onClick={handleClick}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleDeleteList} sx={{ color: 'error.main' }}>Delete List</MenuItem>
            </Menu>
          </Box>

          {/* Cards Container (Scrollable) */}
          <Droppable droppableId={listId} type="card">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  px: 0.5,
                  mb: 1,
                  minHeight: '2px', // Ensure drop target exists even if empty
                  // Custom Scrollbar
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    borderRadius: '8px'
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'action.hover',
                    borderRadius: '8px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#bfc4ce', // Keep specific scrollbar color or add to theme
                    borderRadius: '8px'
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#aeb5c0'
                  }
                }}
              >
                {cards.map((card, index) => (
                  <Card 
                    key={card.card_id || card.id} 
                    card={card}
                    index={index}
                    onClick={() => onCardClick(card)}
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>

          {/* Add Card Section */}
          {isAdding ? (
        <Box sx={{ px: 0.5 }}>
          <TextField
            fullWidth
            multiline
            autoFocus
            placeholder="Enter a title for this card..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleCreateCard()
              }
            }}
            sx={{
              bgcolor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 0 rgba(9,30,66,.25)',
              mb: 1,
              '& .MuiOutlinedInput-root': {
                padding: '8px 12px',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' }
              }
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleCreateCard}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' }
              }}
            >
              Add card
            </Button>
            <IconButton size="small" onClick={() => setIsAdding(false)} sx={{ color: 'trello.textSecondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Button
          startIcon={<AddIcon />}
          onClick={() => setIsAdding(true)}
          sx={{
            justifyContent: 'flex-start',
            color: 'trello.textSecondary',
            textTransform: 'none',
            fontWeight: 400,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'action.hover',
              color: 'trello.textMain'
            }
          }}
        >
          Add a card
        </Button>
      )}
        </Box>
      )}
    </Draggable>
  )
}

export default List
