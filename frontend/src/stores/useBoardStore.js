import { create } from 'zustand'
import boardService from '../services/boardService'

export const useBoardStore = create((set) => ({
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,

  fetchBoards: async () => {
    set({ loading: true, error: null })
    try {
      const boards = await boardService.getBoards()
      set({ boards, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  createBoard: async (boardData) => {
    set({ loading: true, error: null })
    try {
      const newBoard = await boardService.createBoard(boardData)
      set((state) => ({ 
        boards: [...state.boards, newBoard], 
        loading: false 
      }))
      return newBoard
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  fetchBoard: async (id) => {
    set({ loading: true, error: null, currentBoard: null })
    try {
      const board = await boardService.getBoard(id)
      set({ currentBoard: board, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}))
