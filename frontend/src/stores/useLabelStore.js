import { create } from 'zustand'
import axios from '../libs/axios'

export const useLabelStore = create((set, get) => ({
  labels: [],
  cardLabels: [], // Labels for the currently viewed card
  loading: false,
  error: null,

  fetchBoardLabels: async (boardId) => {
    set({ loading: true })
    try {
      const response = await axios.get(`/labels/board/${boardId}`)
      set({ labels: response.data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  fetchCardLabels: async (cardId) => {
    set({ loading: true })
    try {
      const response = await axios.get(`/labels/card/${cardId}`)
      set({ cardLabels: response.data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  createLabel: async (boardId, name, color) => {
    try {
      const response = await axios.post(`/labels/board/${boardId}`, { name, color })
      set((state) => ({ labels: [...state.labels, response.data] }))
      return response.data
    } catch (error) {
      console.error('Error creating label:', error)
      throw error
    }
  },

  updateLabel: async (labelId, name, color) => {
    try {
      const response = await axios.put(`/labels/${labelId}`, { name, color })
      set((state) => ({
        labels: state.labels.map((l) => (l.label_id === labelId ? response.data : l)),
        cardLabels: state.cardLabels.map((l) => (l.label_id === labelId ? response.data : l))
      }))
    } catch (error) {
      console.error('Error updating label:', error)
      throw error
    }
  },

  addLabelToCard: async (cardId, labelId) => {
    try {
      await axios.post(`/labels/card/${cardId}/${labelId}`)
      const label = get().labels.find((l) => l.label_id === labelId)
      if (label) {
        set((state) => ({ cardLabels: [...state.cardLabels, label] }))
      }
    } catch (error) {
      console.error('Error adding label to card:', error)
      throw error
    }
  },

  removeLabelFromCard: async (cardId, labelId) => {
    try {
      await axios.delete(`/labels/card/${cardId}/${labelId}`)
      set((state) => ({
        cardLabels: state.cardLabels.filter((l) => l.label_id !== labelId)
      }))
    } catch (error) {
      console.error('Error removing label from card:', error)
      throw error
    }
  },
  
  clearCardLabels: () => set({ cardLabels: [] })
}))
