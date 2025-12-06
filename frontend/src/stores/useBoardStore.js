import { create } from 'zustand'
import boardService from '../services/boardService'

export const useBoardStore = create((set) => ({
  workspace: null,
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
  isCreateBoardOpen: false,

  setCreateBoardOpen: (isOpen) => set({ isCreateBoardOpen: isOpen }),

  fetchWorkspace: async () => {
    try {
      set({ loading: true, error: null })
      const workspace = await boardService.getWorkspace()
      set({ workspace })
    } catch (error) {
      set({ error: error.message, loading: false })
    } finally {
      set({ loading: false })
    }
  },

  updateWorkspaceName: async (id, name) => {
    try {
      set({ loading: true, error: null })
      const updatedWorkspace = await boardService.updateWorkspace(id, name)
      set({ workspace: updatedWorkspace })
      return updatedWorkspace
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    } finally {
      set({ loading: false })
    }
  },

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
  },

  createCard: async (listId, name) => {
    try {
      const newCard = await boardService.createCard({ listId, name })
      set((state) => {
        if (!state.currentBoard) return state
        const newLists = state.currentBoard.lists.map((list) => {
          if (list.list_id === listId) {
            return { ...list, cards: [...list.cards, newCard] }
          }
          return list
        })
        return { currentBoard: { ...state.currentBoard, lists: newLists } }
      })
    } catch (error) {
      console.error(error)
    }
  },

  createList: async (boardId, name) => {
    try {
      const newList = await boardService.createList({ boardId, name })
      set((state) => {
        if (!state.currentBoard) return state
        return { 
          currentBoard: { 
            ...state.currentBoard, 
            lists: [...state.currentBoard.lists, newList] 
          } 
        }
      })
    } catch (error) {
      console.error(error)
    }
  },

  updateBoard: async (id, updates) => {
    try {
      // If updates is just a string, assume it's the name (backward compatibility)
      const data = typeof updates === 'string' ? { name: updates } : updates
      
      const updatedBoard = await boardService.updateBoard(id, data)
      set((state) => ({
        currentBoard: { ...state.currentBoard, ...updatedBoard },
        boards: state.boards.map(b => b.board_id === id ? { ...b, ...updatedBoard } : b)
      }))
    } catch (error) {
      console.error(error)
    }
  },

  updateList: async (id, name) => {
    try {
      const updatedList = await boardService.updateList(id, { name })
      set((state) => {
        if (!state.currentBoard) return state
        const newLists = state.currentBoard.lists.map((list) => {
          if (list.list_id === id) {
            return { ...list, name: updatedList.name }
          }
          return list
        })
        return { currentBoard: { ...state.currentBoard, lists: newLists } }
      })
    } catch (error) {
      console.error(error)
    }
  },

  deleteList: async (id) => {
    try {
      await boardService.deleteList(id)
      set((state) => {
        if (!state.currentBoard) return state
        const newLists = state.currentBoard.lists.filter((list) => list.list_id !== id)
        return { currentBoard: { ...state.currentBoard, lists: newLists } }
      })
    } catch (error) {
      console.error(error)
    }
  },

  deleteCard: async (id) => {
    try {
      await boardService.deleteCard(id)
      set((state) => {
        if (!state.currentBoard) return state
        const newLists = state.currentBoard.lists.map((list) => {
          const newCards = list.cards.filter((card) => card.card_id !== id)
          return { ...list, cards: newCards }
        })
        return { currentBoard: { ...state.currentBoard, lists: newLists } }
      })
    } catch (error) {
      console.error(error)
    }
  },

  updateCard: async (id, name) => {
    try {
      const updatedCard = await boardService.updateCard(id, { name })
      set((state) => {
        if (!state.currentBoard) return state
        const newLists = state.currentBoard.lists.map((list) => {
          const cardIndex = list.cards.findIndex(c => c.card_id === id)
          if (cardIndex !== -1) {
            const newCards = [...list.cards]
            newCards[cardIndex] = { ...newCards[cardIndex], name: updatedCard.name }
            return { ...list, cards: newCards }
          }
          return list
        })
        return { currentBoard: { ...state.currentBoard, lists: newLists } }
      })
    } catch (error) {
      console.error(error)
    }
  },

  moveList: async (listId, newPosition, newLists) => {
    // Optimistic update
    set((state) => ({
      currentBoard: { ...state.currentBoard, lists: newLists }
    }))
    try {
      await boardService.updateListOrder(listId, newPosition)
    } catch (error) {
      console.error(error)
      // Revert on error (could implement fetchBoard here to sync)
    }
  },

  moveCard: async (cardId, newListId, newPosition, newLists) => {
    // Optimistic update
    set((state) => ({
      currentBoard: { ...state.currentBoard, lists: newLists }
    }))
    try {
      await boardService.updateCardOrder(cardId, newListId, newPosition)
    } catch (error) {
      console.error(error)
    }
  }
}))
