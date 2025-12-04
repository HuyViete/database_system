import { create } from 'zustand'
import authService from '../services/authService'

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  
  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    set({ user, accessToken, refreshToken: refreshToken || get().refreshToken })
  },

  login: async (email, password) => {
    const data = await authService.login(email, password)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken })
    return data
  },

  signup: async (userData) => {
    return await authService.signup(userData)
  },

  monitorLogin: async (token) => {
    const data = await authService.monitorLogin(token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('accessToken', data.token)
    set({ user: data.user, accessToken: data.token })
    return data
  },
  
  signOut: async () => {
    const refreshToken = get().refreshToken
    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch (e) {
        console.error(e)
      }
    }
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({ user: null, accessToken: null, refreshToken: null })
  },

  setAccessToken: (token) => {
    localStorage.setItem('accessToken', token)
    set({ accessToken: token })
  }
}))
