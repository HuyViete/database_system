import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Button,
  Avatar,
  Chip,
  DialogTitle
} from '@mui/material'
import {
  Close as CloseIcon,
  CreditCard as CreditCardIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
  MoreHoriz
} from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useBoardStore } from '../stores/useBoardStore'
import { useAuthStore } from '../stores/useAuthStore'
import { useCommentStore } from '../stores/useCommentStore'
import Comment from './Comment'

function CardDetailModal({ open, onClose, card, listName }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(null)
  const [comment, setComment] = useState('')
  const { updateCard } = useBoardStore()
  const { user } = useAuthStore()
  const { comments, fetchComments, addComment, editComment, removeComment, clearComments } = useCommentStore()

  useEffect(() => {
    if (card) {
      setTitle(card.name || '')
      setDescription(card.description || '')
      setDueDate(card.due_date ? dayjs(card.due_date) : null)
      if (card.card_id) {
        fetchComments(card.card_id)
      }
    } else {
      clearComments()
    }
  }, [card, fetchComments, clearComments])

  const handleSendComment = async () => {
    if (!comment.trim()) return
    try {
      await addComment(card.card_id, comment)
      setComment('')
    } catch (error) {
      console.error('Failed to create comment:', error)
    }
  }

  const handleEditComment = async (commentId, newText) => {
    try {
      await editComment(commentId, newText)
    } catch (error) {
      console.error('Failed to update comment:', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return
    try {
      await removeComment(commentId)
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    if (card && title !== card.name) {
      updateCard(card.card_id, title)
    }
  }

  const isOverdue = dueDate && dayjs().isAfter(dueDate, 'day')

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'trello.modalBg',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle
        sx={{
          p: 1.5,
          display: 'flex',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'trello.modalBg',
        }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <IconButton>
          <MoreHoriz />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: 'trello.modalBg', pt: 0, p: 0 }}>
        <Grid
          container
          spacing={0}
          alignItems="stretch"
          sx={{ minHeight: '50vh' }}
        >
          {/* Left Column */}
            <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                p: 2.5,
                border: '1px solid',
                borderColor: 'trello.commentPanelBorder',
              }} >
              {/* Header Section */}
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CreditCardIcon sx={{ mt: 0.5, color: 'text.secondary' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    InputProps={{
                      disableUnderline: true,
                      sx: { fontSize: '1.25rem', fontWeight: 600, bgcolor: 'transparent' }
                    }}
                    sx={{ mb: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    in list <Typography component="span" sx={{ textDecoration: 'underline' }}>{listName}</Typography>
                  </Typography>
                </Box>
              </Box>
              {/* Due Date Section */}
              <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                <AccessTimeIcon sx={{ mt: 0.5, color: 'text.secondary' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                    Due Date
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                        slotProps={{ 
                          textField: { 
                            size: 'small',
                            sx: { 
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'trello.inputBg',
                                '&.Mui-focused': { backgroundColor: 'trello.inputBg' },
                                '& fieldset': { borderColor: 'trello.inputBorder' },
                                '&:hover fieldset': { borderColor: 'trello.inputBorderHover' }
                              }
                            }
                          } 
                        }}
                      />
                    </LocalizationProvider>
                    {isOverdue && (
                      <Chip 
                        label="Overdue" 
                        color="error" 
                        size="small" 
                        sx={{ borderRadius: '4px', fontWeight: 'bold' }} 
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Description Section */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DescriptionIcon sx={{ mt: 0.5, color: 'text.secondary' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
                    Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="Add a more detailed description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'trello.inputBg',
                        '&.Mui-focused': { backgroundColor: 'trello.inputBg' },
                        '& fieldset': { borderColor: 'trello.inputBorder' },
                        '&:hover fieldset': { borderColor: 'trello.inputBorderHover' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>

          {/* Right Column - Comments */}
          <Box
            sx={{
              bgcolor: 'trello.commentPanelBg',
              border: '1px solid',
              borderColor: 'trello.commentPanelBorder',
              borderLeft: 'none',
              p: 2.5,
              width: '50%'
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <CommentIcon sx={{ mt: 0.5, color: 'text.secondary' }} />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                Comments
              </Typography>
            </Box>
            
            {/* Add Comment */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Avatar 
                  src={user?.avatar_url} 
                  alt={user?.username}
                  sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'trello.inputBg',
                        '&.Mui-focused': { backgroundColor: 'trello.inputBg' },
                        '& fieldset': { borderColor: 'trello.inputBorder' },
                        '&:hover fieldset': { borderColor: 'trello.inputBorderHover' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                      },
                      mb: 2
                    }}
                  />
                  <Button 
                    variant="contained" 
                    disabled={!comment.trim()}
                    startIcon={<SendIcon />}
                    size="small"
                    onClick={handleSendComment}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Comments List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {comments.length > 0 ? (
                comments.map((c) => (
                  <Comment 
                    key={c.comment_id} 
                    comment={c} 
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                    currentUser={user}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', ml: 6 }}>
                  No comments yet.
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default CardDetailModal
