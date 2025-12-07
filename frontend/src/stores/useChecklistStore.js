import { create } from 'zustand'
import axios from '../libs/axios'

export const useChecklistStore = create((set, get) => ({
  checklists: [],
  loading: false,
  error: null,

  fetchChecklists: async (cardId) => {
    set({ loading: true })
    try {
      const response = await axios.get(`/cards/${cardId}/checklists`)
      set({ checklists: response.data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  createChecklist: async (cardId, name) => {
    try {
      const response = await axios.post(`/cards/${cardId}/checklists`, { name })
      set(state => ({ checklists: [...state.checklists, response.data] }))
      return response.data
    } catch (error) {
      console.error('Failed to create checklist:', error)
      throw error
    }
  },

  deleteChecklist: async (checklistId) => {
    try {
      await axios.delete(`/checklists/${checklistId}`)
      set(state => ({
        checklists: state.checklists.filter(c => c.checklist_id !== checklistId)
      }))
    } catch (error) {
      console.error('Failed to delete checklist:', error)
      throw error
    }
  },

  addItem: async (checklistId, description) => {
    try {
      const response = await axios.post(`/checklists/${checklistId}/items`, { description })
      set(state => ({
        checklists: state.checklists.map(c => 
          c.checklist_id === checklistId 
            ? { ...c, items: [...c.items, response.data] }
            : c
        )
      }))
    } catch (error) {
      console.error('Failed to add item:', error)
      throw error
    }
  },

  updateItem: async (checklistId, itemId, updates) => {
    try {
      const response = await axios.put(`/items/${itemId}`, updates)
      set(state => ({
        checklists: state.checklists.map(c => 
          c.checklist_id === checklistId 
            ? { 
                ...c, 
                items: c.items.map(i => i.item_id === itemId ? response.data : i)
              }
            : c
        )
      }))
    } catch (error) {
      console.error('Failed to update item:', error)
      throw error
    }
  },

  deleteItem: async (checklistId, itemId) => {
    try {
      await axios.delete(`/items/${itemId}`)
      set(state => ({
        checklists: state.checklists.map(c => 
          c.checklist_id === checklistId 
            ? { ...c, items: c.items.filter(i => i.item_id !== itemId) }
            : c
        )
      }))
    } catch (error) {
      console.error('Failed to delete item:', error)
      throw error
    }
  },
  
  clearChecklists: () => set({ checklists: [] })
}))
