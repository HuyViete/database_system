import { create } from 'zustand'
import { toast } from 'sonner'
import { authService } from '../services/authService'

export const useAuthStore = create ((set, get) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  user: localStorage.getItem('role') ? {
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role'),
    warehouseId: localStorage.getItem('warehouseId')
  } : null,
  loading: false,

  signUp: async (username, password, email, firstName, lastName, exp, role) => {
    try {
      set({ loading: true })

      await authService.signUp(username, password, email, firstName, lastName, exp, role)

      toast.success('Sign up success! Navigate to login')
    } catch (error) {
      console.error(error)
      toast.error('Fail to sign up')
    } finally {
      set({ loading: false })
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true })

      const data = await authService.signIn(username, password)
      set({
        accessToken: data.token,
        user: {
          username: data.username,
          role: data.role,
          warehouseId: data.warehouseId
        }
      })

      await authService.fetchMe()

      // Store in localStorage for persistence
      localStorage.setItem('accessToken', data.token)
      localStorage.setItem('username', data.username)
      localStorage.setItem('role', data.role)
      if (data.warehouseId) {
        localStorage.setItem('warehouseId', data.warehouseId)
      } else {
        localStorage.removeItem('warehouseId')
      }

      toast.success('Sign in success!')
      return data.role
    } catch (error) {
      console.error(error)
      toast.error('Fail to sign in')
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    try {
      set({ loading: true })

      await authService.signOut()

      // Clear user state
      set({
        accessToken: null,
        user: null
      })

      // Clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      localStorage.removeItem('warehouseId')

      toast.success('Sign out success!')
    } catch (error) {
      console.error(error)
      toast.error('Fail to sign out')
    } finally {
      set({ loading: false })
    }
  },

  updateUserWarehouse: (warehouseId) => {
    const currentUser = get().user
    if (currentUser) {
      const newUser = { ...currentUser, warehouseId }
      set({ user: newUser })
      localStorage.setItem('warehouseId', warehouseId)
    }
  }
}))
