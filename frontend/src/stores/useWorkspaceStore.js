import { create } from 'zustand'
import { getWorkspaceMembers } from '../services/workspaceService'

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
}))
