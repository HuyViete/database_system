import { create } from 'zustand'
import authService from '../services/authService'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    set({ user, token })
  },

  login: async (email, password) => {
    const data = await authService.login(email, password)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    set({ user: data.user, token: data.token })
    return data
  },

  signup: async (userData) => {
    return await authService.signup(userData)
  },

  monitorLogin: async (token) => {
    const data = await authService.monitorLogin(token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    set({ user: data.user, token: data.token })
    return data
  },
  
  signOut: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    set({ user: null, token: null })
  }
}))
