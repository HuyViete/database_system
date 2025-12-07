import { create } from 'zustand'
import { getWorkspaceMembers } from '../services/workspaceService'
import axios from '../libs/axios'

export const useWorkspaceStore = create((set) => ({
  members: [],
  loading: false,
  error: null,

  fetchMembers: async (workspaceId) => {
    set({ loading: true, error: null })
    try {
      const members = await getWorkspaceMembers(workspaceId)
      set({ members, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  inviteMember: async (workspaceId, email) => {
    try {
      await axios.post(`/workspaces/${workspaceId}/invitations`, { email })
    } catch (error) {
      console.error('Failed to invite member:', error)
      throw error
    }
  }
}))
