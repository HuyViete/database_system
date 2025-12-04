import { useState } from 'react'
import { Box, Typography, IconButton, Button, TextField } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import Card from './Card'
import { useBoardStore } from '../stores/useBoardStore'

function List({ listId, title, cards = [] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const { createCard } = useBoardStore()

  const handleCreateCard = async () => {
    if (!newCardTitle.trim()) return
    await createCard(listId, newCardTitle)
    setNewCardTitle('')
    setIsAdding(false)
  }

  return (
    <Box
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
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'trello.textMain',
            cursor: 'pointer'
          }}
        >
          {title}
        </Typography>
        <IconButton size="small" sx={{ borderRadius: 1, color: 'trello.textSecondary', '&:hover': { backgroundColor: 'action.hover' } }}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Cards Container (Scrollable) */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 0.5,
          mb: 1,
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
        {cards.map((card) => (
          <Card 
            key={card.card_id || card.id} 
            title={card.name || card.title} 
            labels={card.labels || []} 
            members={card.members || []} 
          />
        ))}
      </Box>

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
  )
}

export default List
