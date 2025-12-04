import { Box, Typography, IconButton, Button } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AddIcon from '@mui/icons-material/Add'
import Card from './Card'

function List({ title, cards = [] }) {
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

      {/* Add Card Button */}
      <Button
        startIcon={<AddIcon />}
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
    </Box>
  )
}

export default List
