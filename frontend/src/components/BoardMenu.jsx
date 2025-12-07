import { useState } from 'react'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Grid,
  TextField,
  Button
} from '@mui/material'
import {
  Close as CloseIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Group as GroupIcon,
  Image as ImageIcon,
  ColorLens as ColorLensIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon
} from '@mui/icons-material'
import { useBoardStore } from '../stores/useBoardStore'

const VISIBILITY_OPTIONS = [
  {
    value: 'private',
    label: 'Private',
    icon: <LockIcon fontSize="small" />,
    description: 'Only board members can see this board. Workspace admins can close the board or remove members.'
  },
  {
    value: 'workspace',
    label: 'Workspace',
    icon: <GroupIcon fontSize="small" />,
    description: 'All members of the Trello Workspace can see and edit this board.'
  },
  {
    value: 'public',
    label: 'Public',
    icon: <PublicIcon fontSize="small" />,
    description: 'Anyone on the internet can see this board. Only board members can edit.'
  }
]

const COLORS = [
  '#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91', '#4bbf6b', '#00aecc', '#838c91'
]

function BoardMenu({ open, onClose, board }) {
  const { updateBoard } = useBoardStore()
  const [currentView, setCurrentView] = useState('main') // main, visibility, background
  const [bgUrl, setBgUrl] = useState('')

  const handleVisibilityChange = async (visibility) => {
    await updateBoard(board.board_id, { visibility })
    setCurrentView('main')
  }

  const handleColorChange = async (color) => {
    await updateBoard(board.board_id, { background_color: color, background_img: null })
  }

  const handleImageChange = async () => {
    if (!bgUrl) return
    await updateBoard(board.board_id, { background_img: bgUrl, background_color: null })
    setBgUrl('')
  }

  const renderHeader = (title, onBack) => (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      {onBack && (
        <IconButton size="small" onClick={onBack} sx={{ position: 'absolute', left: 8 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      )}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1, textAlign: 'center' }}>
        {title}
      </Typography>
      <IconButton size="small" onClick={onClose} sx={{ position: 'absolute', right: 8 }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )

  const renderMainView = () => (
    <>
      {renderHeader('Menu')}
      <Box sx={{ p: 2 }}>
        <List disablePadding>
          <ListItemButton onClick={() => setCurrentView('visibility')}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {VISIBILITY_OPTIONS.find(v => v.value === board?.visibility)?.icon || <LockIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText 
              primary="Visibility" 
              secondary={VISIBILITY_OPTIONS.find(v => v.value === board?.visibility)?.label || 'Private'} 
            />
          </ListItemButton>
          <ListItemButton onClick={() => setCurrentView('background')}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ImageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Change Background" />
          </ListItemButton>
        </List>
      </Box>
    </>
  )

  const renderVisibilityView = () => (
    <>
      {renderHeader('Change visibility', () => setCurrentView('main'))}
      <Box sx={{ p: 2 }}>
        <List disablePadding>
          {VISIBILITY_OPTIONS.map((option) => (
            <ListItemButton 
              key={option.value} 
              onClick={() => handleVisibilityChange(option.value)}
              sx={{ display: 'block', mb: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Box sx={{ mr: 1, display: 'flex', color: 'text.secondary' }}>{option.icon}</Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{option.label}</Typography>
                {board?.visibility === option.value && <CheckIcon fontSize="small" sx={{ ml: 'auto' }} />}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3 }}>
                {option.description}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </>
  )

  const renderBackgroundView = () => (
    <>
      {renderHeader('Change background', () => setCurrentView('main'))}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Colors</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 3 }}>
          {COLORS.map((color) => (
            <Box
              key={color}
              onClick={() => handleColorChange(color)}
              sx={{
                height: 60,
                bgcolor: color,
                borderRadius: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': { opacity: 0.8 }
              }}
            >
              {board?.background_color === color && <CheckIcon sx={{ color: 'white' }} />}
            </Box>
          ))}
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Image URL</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Enter image URL..."
            value={bgUrl}
            onChange={(e) => setBgUrl(e.target.value)}
          />
          <Button variant="contained" onClick={handleImageChange} disabled={!bgUrl}>
            Set
          </Button>
        </Box>
      </Box>
    </>
  )

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 340 } }}
    >
      {currentView === 'main' && renderMainView()}
      {currentView === 'visibility' && renderVisibilityView()}
      {currentView === 'background' && renderBackgroundView()}
    </Drawer>
  )
}

export default BoardMenu
