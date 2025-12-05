import { Paper, Typography, Box, TextField, IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import theme from '../theme.js'
import { useBoardStore } from '../stores/useBoardStore'
import { Draggable } from '@hello-pangea/dnd'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DeleteIcon from '@mui/icons-material/Delete'

function Card({ card, index }) {
  const { card_id: cardId, name: title, labels = [], members = [] } = card
  const [isEditing, setIsEditing] = useState(false)
  const [cardTitle, setCardTitle] = useState(title)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { updateCard, deleteCard } = useBoardStore()

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (event) => {
    if (event) event.stopPropagation()
    setAnchorEl(null)
  }

  const handleDeleteCard = async (event) => {
    event.stopPropagation()
    if (window.confirm('Are you sure you want to delete this card?')) {
      await deleteCard(cardId)
    }
    handleClose()
  }

  const handleUpdate = async () => {
    if (cardTitle !== title) {
      await updateCard(cardId, cardTitle)
    }
    setIsEditing(false)
  }

  return (
    <Draggable draggableId={cardId} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            backgroundColor: 'trello.cardBg',
            boxShadow: `0px 1px 1px ${theme.vars.palette.trello.border}`,
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'trello.cardHover', // Slight darken on hover
              border: `1px solid ${theme.vars.palette.trello.border}`, // Optional: add border or just change bg
              '& .more-icon': { display: 'flex' }
            },
            marginBottom: 1,
            position: 'relative',
            overflow: 'hidden',
            ...provided.draggableProps.style
          }}
        >
          {/* Labels Row */}
          {labels.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
              {labels.map((label, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 40,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: label.color || 'primary.main'
                  }}
                />
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {isEditing ? (
              <TextField
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                onBlur={handleUpdate}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdate()
                }}
                autoFocus
                multiline
                fullWidth
                size="small"
                onClick={(e) => e.stopPropagation()}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '0.9rem',
                    padding: 0,
                    backgroundColor: 'white',
                  },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
              />
            ) : (
              <Typography
                variant="body1"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                sx={{
                  fontSize: '0.9rem',
                  color: 'trello.textMain',
                  fontWeight: 400,
                  wordWrap: 'break-word',
                  flexGrow: 1
                }}
              >
                {title}
              </Typography>
            )}
            
            {!isEditing && (
              <>
                <IconButton
                  className="more-icon"
                  size="small"
                  onClick={handleClick}
                  sx={{
                    display: 'none',
                    padding: '2px',
                    borderRadius: '4px',
                    color: 'trello.textSecondary',
                    '&:hover': { backgroundColor: 'action.hover' },
                    ml: 1,
                    mt: -0.5
                  }}
                >
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MenuItem onClick={handleDeleteCard} sx={{ color: 'error.main', gap: 1 }}>
                    <DeleteIcon fontSize="small" />
                    <Typography variant="body2">Delete</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

      {/* Footer / Members Row */}
      {members.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          {/* Placeholder for member avatars */}
          {members.map((member, index) => (
            <Box
              key={index}
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'trello.textMain',
                ml: -0.5,
                border: `2px solid ${theme.vars.palette.trello.cardBg}`
              }}
            >
              {member.initials}
            </Box>
          ))}
        </Box>
      )}
        </Paper>
      )}
    </Draggable>
  )
}

export default Card
