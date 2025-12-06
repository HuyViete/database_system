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
  DialogTitle,
  Popover,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
  ListItemIcon
} from '@mui/material'
import {
  Close as CloseIcon,
  CreditCard as CreditCardIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
  MoreHoriz,
  Add as AddIcon,
  Label as LabelIcon,
  CheckBox as CheckBoxIcon,
  Person as PersonIcon,
  AttachFile as AttachFileIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useBoardStore } from '../stores/useBoardStore'
import { useAuthStore } from '../stores/useAuthStore'
import { useCommentStore } from '../stores/useCommentStore'
import { useLabelStore } from '../stores/useLabelStore'
import Comment from './Comment'

function CardDetailModal({ open, onClose, card, listName }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(null)
  const [comment, setComment] = useState('')
  const { updateCard } = useBoardStore()
  const { user } = useAuthStore()
  const { comments, fetchComments, addComment, editComment, removeComment, clearComments } = useCommentStore()
  const { currentBoard } = useBoardStore()
  const { labels, cardLabels, fetchBoardLabels, fetchCardLabels, createLabel, updateLabel, addLabelToCard, removeLabelFromCard } = useLabelStore()

  const [labelAnchorEl, setLabelAnchorEl] = useState(null)
  const [labelSearch, setLabelSearch] = useState('')
  const [labelView, setLabelView] = useState('list') // 'list', 'create', 'edit'
  const [editingLabel, setEditingLabel] = useState(null)
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('')

  const BASIC_COLORS = [
    '#61bd4f', // Green
    '#f2d600', // Yellow
    '#ff9f1a', // Orange
    '#eb5a46', // Red
    '#c377e0', // Pink
    '#00c2e0'  // Sky
  ]

  useEffect(() => {
    if (card) {
      setTitle(card.name || '')
      setDescription(card.description || '')
      setDueDate(card.due_date ? dayjs(card.due_date) : null)
      if (card.card_id) {
        fetchComments(card.card_id)
        if (currentBoard) {
          fetchBoardLabels(currentBoard.board_id)
          fetchCardLabels(card.card_id)
        }
      }
    } else {
      clearComments()
    }
  }, [card, fetchComments, clearComments, currentBoard, fetchBoardLabels, fetchCardLabels])

  const handleLabelClick = (event) => {
    setLabelAnchorEl(event.currentTarget)
    setLabelView('list')
    setLabelSearch('')
  }

  const handleLabelClose = () => {
    setLabelAnchorEl(null)
    setLabelView('list')
  }

  const handleToggleLabel = async (label) => {
    const isSelected = cardLabels.some(l => l.label_id === label.label_id)
    if (isSelected) {
      await removeLabelFromCard(card.card_id, label.label_id)
    } else {
      await addLabelToCard(card.card_id, label.label_id)
    }
  }

  const handleCreateLabel = async () => {
    if (!newLabelColor) return
    try {
      await createLabel(currentBoard.board_id, newLabelName, newLabelColor)
      setLabelView('list')
      setNewLabelName('')
      setNewLabelColor('')
    } catch (error) {
      console.error('Failed to create label:', error)
    }
  }

  const handleUpdateLabel = async () => {
    if (!editingLabel || !newLabelColor) return
    try {
      await updateLabel(editingLabel.label_id, newLabelName, newLabelColor)
      setLabelView('list')
      setEditingLabel(null)
      setNewLabelName('')
      setNewLabelColor('')
    } catch (error) {
      console.error('Failed to update label:', error)
    }
  }

  const openCreateView = () => {
    setLabelView('create')
    setNewLabelName('')
    setNewLabelColor(BASIC_COLORS[0])
  }

  const openEditView = (label) => {
    setLabelView('edit')
    setEditingLabel(label)
    setNewLabelName(label.name || '')
    setNewLabelColor(label.color)
  }

  const filteredLabels = labels.filter(l => 
    l.name?.toLowerCase().includes(labelSearch.toLowerCase())
  )

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
          p: 1,
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
          sx={{ minHeight: '50vh', maxHeight: '80vh' }}
        >
          {/* Left Column */}
            <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                p: 2.5,
                borderTop: '1px solid',
                borderRight: '1px solid',
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

              {/* Action Buttons */}
              <Box sx={{ mb: 4, ml: 5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button startIcon={<AddIcon />} variant="outlined" size="small" sx={{ color: 'text.secondary', borderColor: 'trello.border', bgcolor: 'trello.cardBg', textTransform: 'none', '&:hover': { bgcolor: 'trello.cardHover' } }}>Add</Button>
                <Button 
                  startIcon={<LabelIcon />} 
                  variant="outlined" 
                  size="small" 
                  onClick={handleLabelClick}
                  sx={{ color: 'text.secondary', borderColor: 'trello.border', bgcolor: 'trello.cardBg', textTransform: 'none', '&:hover': { bgcolor: 'trello.cardHover' } }}
                >
                  Labels
                </Button>
                <Button startIcon={<CheckBoxIcon />} variant="outlined" size="small" sx={{ color: 'text.secondary', borderColor: 'trello.border', bgcolor: 'trello.cardBg', textTransform: 'none', '&:hover': { bgcolor: 'trello.cardHover' } }}>Checklist</Button>
                <Button startIcon={<PersonIcon />} variant="outlined" size="small" sx={{ color: 'text.secondary', borderColor: 'trello.border', bgcolor: 'trello.cardBg', textTransform: 'none', '&:hover': { bgcolor: 'trello.cardHover' } }}>Members</Button>
                <Button startIcon={<AttachFileIcon />} variant="outlined" size="small" sx={{ color: 'text.secondary', borderColor: 'trello.border', bgcolor: 'trello.cardBg', textTransform: 'none', '&:hover': { bgcolor: 'trello.cardHover' } }}>Attachment</Button>
              </Box>

              {/* Labels Section */}
              {cardLabels.length > 0 && (
                <Box sx={{ mb: 4, ml: 5 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                    Labels
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {cardLabels.map((label) => (
                      <Chip
                        key={label.label_id}
                        label={label.name}
                        sx={{ 
                          bgcolor: label.color, 
                          color: '#fff',
                          fontWeight: 500,
                          borderRadius: '4px',
                          height: '32px',
                          '&:hover': { opacity: 0.85 }
                        }}
                        onClick={handleLabelClick}
                      />
                    ))}
                    <IconButton 
                      size="small" 
                      sx={{ bgcolor: 'trello.inputBg', borderRadius: '4px', width: 32, height: 32 }}
                      onClick={handleLabelClick}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}

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
              borderTop: '1px solid',
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

      {/* Labels Popover */}
      <Popover
        open={Boolean(labelAnchorEl)}
        anchorEl={labelAnchorEl}
        onClose={handleLabelClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { width: 300, p: 2 }
        }}
      >
        {labelView === 'list' && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative' }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600 }}>
                Labels
              </Typography>
              <IconButton size="small" onClick={handleLabelClose} sx={{ position: 'absolute', right: -8, top: -8 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <TextField
              fullWidth
              size="small"
              placeholder="Search labels..."
              value={labelSearch}
              onChange={(e) => setLabelSearch(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}>
              Labels
            </Typography>
            
            <List sx={{ p: 0, mb: 2 }}>
              {filteredLabels.map((label) => {
                const isChecked = cardLabels.some(l => l.label_id === label.label_id)
                return (
                  <ListItem key={label.label_id} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                      onClick={() => handleToggleLabel(label)}
                      sx={{ p: 0, borderRadius: 1, overflow: 'hidden' }}
                    >
                      <Box sx={{ 
                        width: '100%', 
                        height: 32, 
                        bgcolor: label.color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        px: 1.5,
                        borderRadius: 1,
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: 0.8 }
                      }}>
                        <Typography sx={{ flexGrow: 1, color: '#fff', fontWeight: 500, fontSize: '0.875rem' }}>
                          {label.name}
                        </Typography>
                        {isChecked && <CheckBoxIcon sx={{ color: '#fff', fontSize: 18 }} />}
                      </Box>
                    </ListItemButton>
                    <IconButton 
                      size="small" 
                      sx={{ ml: 0.5 }}
                      onClick={() => openEditView(label)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                )
              })}
            </List>
            
            <Button 
              fullWidth 
              variant="contained" 
              sx={{ bgcolor: 'trello.inputBg', color: 'text.primary', '&:hover': { bgcolor: 'trello.inputBorder' } }}
              onClick={openCreateView}
            >
              Create a new label
            </Button>
          </>
        )}

        {(labelView === 'create' || labelView === 'edit') && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative' }}>
              <IconButton size="small" onClick={() => setLabelView('list')} sx={{ position: 'absolute', left: -8, top: -8 }}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography variant="subtitle1" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600 }}>
                {labelView === 'create' ? 'Create label' : 'Edit label'}
              </Typography>
              <IconButton size="small" onClick={handleLabelClose} sx={{ position: 'absolute', right: -8, top: -8 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ 
              height: 100, 
              bgcolor: 'trello.inputBg', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2,
              borderRadius: 1
            }}>
              <Box sx={{ 
                bgcolor: newLabelColor, 
                px: 2, 
                py: 0.5, 
                borderRadius: 1, 
                minWidth: 40, 
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography sx={{ color: '#fff', fontWeight: 500 }}>{newLabelName || 'Title'}</Typography>
              </Box>
            </Box>

            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Title
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Select a color
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {BASIC_COLORS.map((color) => (
                <Grid item xs={4} key={color}>
                  <Box
                    onClick={() => setNewLabelColor(color)}
                    sx={{
                      height: 32,
                      bgcolor: color,
                      borderRadius: 1,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': { opacity: 0.8 },
                      border: newLabelColor === color ? '2px solid #0079bf' : 'none'
                    }}
                  >
                    {newLabelColor === color && <CheckBoxIcon sx={{ color: '#fff', fontSize: 18 }} />}
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                variant="contained" 
                onClick={labelView === 'create' ? handleCreateLabel : handleUpdateLabel}
              >
                {labelView === 'create' ? 'Create' : 'Save'}
              </Button>
              {labelView === 'edit' && (
                <Button color="error" onClick={() => {/* Handle delete */}}>Delete</Button>
              )}
            </Box>
          </>
        )}
      </Popover>

    </Dialog>
  )
}

export default CardDetailModal
