import { create } from 'zustand'
import { getComments, createComment, updateComment, deleteComment } from '../services/commentService'

export const useCommentStore = create((set, get) => ({
  comments: [],
  loading: false,
  error: null,

  fetchComments: async (cardId) => {
    set({ loading: true, error: null })
    try {
      const data = await getComments(cardId)
      set({ comments: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  addComment: async (cardId, text) => {
    set({ loading: true, error: null })
    try {
      const newComment = await createComment(cardId, text)
      set((state) => ({ 
        comments: [newComment, ...state.comments], 
        loading: false 
      }))
      return newComment
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  editComment: async (commentId, text) => {
    set({ loading: true, error: null })
    try {
      const updatedComment = await updateComment(commentId, text)
      set((state) => ({
        comments: state.comments.map((c) => 
          c.comment_id === commentId ? updatedComment : c
        ),
        loading: false
      }))
      return updatedComment
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  removeComment: async (commentId) => {
    set({ loading: true, error: null })
    try {
      await deleteComment(commentId)
      set((state) => ({
        comments: state.comments.filter((c) => c.comment_id !== commentId),
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  clearComments: () => set({ comments: [], error: null })
}))
