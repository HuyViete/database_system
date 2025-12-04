import { create } from 'zustand'

export const useAlertStore = create((set) => ({
  unreadCount: 0,
  fetchAlerts: () => {},
  connectSocket: () => {},
}))
