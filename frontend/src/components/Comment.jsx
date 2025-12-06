import React, { useState } from 'react'
import { Box, Typography, Avatar, TextField, Button } from '@mui/material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: 'Just now',
    m: "1 minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "yesterday",
    dd: "%d days",
    M: "last month",
    MM: "%d months",
    y: "last year",
    yy: "%d years"
  }
})

const Comment = ({ comment, onEdit, onDelete, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(comment.text)

  const handleSave = () => {
    if (editedText.trim() !== comment.text) {
      onEdit(comment.comment_id, editedText)
    }
    setIsEditing(false)
  }

  // Check if the current user is the owner of the comment
  // Assuming currentUser has an id property that matches member_id
  // Adjust based on actual user object structure
  const isOwner = currentUser && (currentUser.id === comment.member_id || currentUser.user_id === comment.member_id)

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Avatar 
        src={comment.avatar_url} 
        alt={comment.username} 
        sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}
      >
        {comment.username?.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {comment.first_name} {comment.last_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dayjs(comment.time_created).fromNow()}
          </Typography>
        </Box>

        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              size="small"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              sx={{ 
                mb: 1, 
                bgcolor: 'white',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                }
              }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                variant="contained" 
                onClick={handleSave}
                disabled={!editedText.trim()}
              >
                Save
              </Button>
              <Button size="small" onClick={() => {
                setIsEditing(false)
                setEditedText(comment.text)
              }}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ 
              bgcolor: 'trello.cardBg', 
              p: 1.5, 
              borderRadius: 2, 
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              display: 'inline-block',
              minWidth: '200px',
              maxWidth: '100%'
            }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {comment.text}
              </Typography>
            </Box>
            
            {isOwner && (
              <Box sx={{ display: 'flex', gap: 2, mt: 0.5, ml: 1 }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline', color: 'text.primary' } }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline', color: 'error.main' } }}
                  onClick={() => onDelete(comment.comment_id)}
                >
                  Delete
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Comment