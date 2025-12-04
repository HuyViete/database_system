import { Paper, Typography, Box } from '@mui/material'
import theme from '../theme.js'

function Card({ title, labels = [], members = [] }) {

  return (
    <Paper
      sx={{
        backgroundColor: 'trello.cardBg',
        boxShadow: `0px 1px 1px ${theme.vars.palette.trello.border}`,
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'trello.cardHover', // Slight darken on hover
          border: `1px solid ${theme.vars.palette.trello.border}` // Optional: add border or just change bg
        },
        marginBottom: 1,
        position: 'relative',
        overflow: 'hidden'
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

      <Typography
        variant="body1"
        sx={{
          fontSize: '0.9rem',
          color: 'trello.textMain',
          fontWeight: 400,
          wordWrap: 'break-word'
        }}
      >
        {title}
      </Typography>

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
  )
}

export default Card
