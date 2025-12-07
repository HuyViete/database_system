import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  PersonAdd as PersonAddIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material'
import AppHeader from '../components/AppHeader'
import Sidebar from '../components/Sidebar'
import { useBoardStore } from '../stores/useBoardStore'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { useAuthStore } from '../stores/useAuthStore'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { toast } from 'sonner'

dayjs.extend(relativeTime)

function Member() {
  const { workspace, fetchWorkspace } = useBoardStore()
  const { members, fetchMembers, inviteMember, loading } = useWorkspaceStore()
  const { user } = useAuthStore()
  const [filter, setFilter] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    fetchWorkspace()
  }, [fetchWorkspace])

  useEffect(() => {
    if (workspace?.workspace_id) {
      fetchMembers(workspace.workspace_id)
    }
  }, [workspace, fetchMembers])

  const filteredMembers = members.filter(member => 
    member.first_name.toLowerCase().includes(filter.toLowerCase()) ||
    member.last_name.toLowerCase().includes(filter.toLowerCase()) ||
    member.username.toLowerCase().includes(filter.toLowerCase())
  )

  const handleInvite = async () => {
    if (!inviteEmail) return
    try {
      await inviteMember(workspace.workspace_id, inviteEmail)
      toast.success('Invitation sent successfully')
      setInviteOpen(false)
      setInviteEmail('')
    } catch (error) {
      toast.error('Failed to send invitation')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.secondary' }}>
      <AppHeader />

      <Box sx={{ display: 'flex', height: 'calc(100vh - 48px)' }}>
        <Sidebar />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          <Box sx={{ maxWidth: 1000 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Collaborators
                </Typography>
                <Chip label={`${members.length} / 10`} size="small" sx={{ bgcolor: 'trello.createBoardBg', fontWeight: 'bold', color: 'text.primary' }} />
              </Box>
              <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setInviteOpen(true)}>
                Invite Workspace members
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 4 }}>
              {/* Left Menu */}
              <Box sx={{ width: 240 }}>
                <List component="nav" sx={{ p: 0 }}>
                  <ListItem button selected sx={{ borderRadius: 1, mb: 0.5, bgcolor: 'trello.navItemActiveBg', color: 'trello.navItemActiveColor', '&.Mui-selected': { bgcolor: 'trello.navItemActiveBg' } }}>
                    <ListItemText primary={`Workspace members (${members.length})`} primaryTypographyProps={{ fontWeight: 500 }} />
                  </ListItem>
                  <ListItem button sx={{ borderRadius: 1, mb: 0.5, color: 'text.secondary' }}>
                    <ListItemText primary="Guests (0)" />
                  </ListItem>
                  <ListItem button sx={{ borderRadius: 1, mb: 0.5, color: 'text.secondary' }}>
                    <ListItemText primary="Join requests (0)" />
                  </ListItem>
                </List>

                <Box sx={{ mt: 4, p: 2, bgcolor: '#89609e', borderRadius: 2, color: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Upgrade for more permissions controls
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Decide who can send invitations, edit Workspace settings, and more with Premium.
                  </Typography>
                  <Typography variant="body2" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    Learn more
                  </Typography>
                </Box>
              </Box>

              {/* Right Content */}
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                    Workspace members ({members.length})
                  </Typography>
                  <Typography variant="body2">
                    Workspace members can view and join all Workspace visible boards and create new boards in the Workspace.
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                    Invite members to join you
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ maxWidth: 500 }}>
                      Anyone with an invite link can join this free Workspace. You can also disable and create a new invite link for this Workspace at any time. Pending invitations count toward the 10 collaborator limit.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button color="inherit" size="small">Disable invite link</Button>
                      <Button variant="outlined" startIcon={<LinkIcon />} size="small" sx={{ bgcolor: 'trello.createBoardBg', border: 'none', color: 'text.primary', '&:hover': { bgcolor: 'trello.createBoardHover', border: 'none' } }}>
                        Invite with link
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <TextField
                  fullWidth
                  placeholder="Filter by name"
                  size="small"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  sx={{ 
                    mb: 2, 
                    maxWidth: 300,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'trello.inputBg',
                      '& fieldset': { borderColor: 'trello.inputBorder' },
                      '&:hover fieldset': { borderColor: 'trello.inputBorderHover' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    }
                  }}
                />

                <List>
                  {filteredMembers.map((member) => (
                    <Box key={member.user_id}>
                      <ListItem 
                        sx={{ 
                          px: 0, 
                          py: 2,
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            src={member.avatar_url} 
                            alt={member.username}
                            sx={{ bgcolor: 'primary.main' }}
                          >
                            {member.username?.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {member.first_name} {member.last_name}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              @{member.username} • Last active {member.last_login ? dayjs(member.last_login).format('MMMM YYYY') : 'Never'}
                            </Typography>
                          }
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Button variant="outlined" size="small" sx={{ bgcolor: 'trello.createBoardBg', border: 'none', color: 'text.primary', '&:hover': { bgcolor: 'trello.createBoardHover', border: 'none' } }}>
                            View boards ({member.board_count || 0})
                          </Button>
                          
                          {member.role === 'Admin' && (
                            <Chip 
                              label="Admin" 
                              size="small" 
                              deleteIcon={<HelpIcon sx={{ fontSize: '14px !important', color: 'text.secondary' }} />}
                              onDelete={() => {}}
                              sx={{ borderRadius: 1, bgcolor: 'trello.createBoardHover', color: 'text.primary' }}
                            />
                          )}

                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<CloseIcon />}
                            sx={{ bgcolor: 'trello.createBoardBg', border: 'none', color: 'text.primary', '&:hover': { bgcolor: 'trello.createBoardHover', border: 'none' } }}
                          >
                            {member.user_id === user?.user_id ? 'Leave...' : 'Remove...'}
                          </Button>
                        </Box>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite to Workspace</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteOpen(false)}>Cancel</Button>
          <Button onClick={handleInvite} variant="contained" disabled={!inviteEmail}>
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Member
