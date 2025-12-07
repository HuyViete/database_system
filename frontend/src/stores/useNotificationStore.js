import { create } from 'zustand';
import axiosInstance from '../libs/axios';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get('/notifications');
            const notifications = response.data;
            const unreadCount = notifications.filter(n => !n.is_read).length;
            set({ notifications, unreadCount, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    markAsRead: async (id) => {
        try {
            await axiosInstance.put(`/notifications/${id}/read`);
            set(state => {
                const notifications = state.notifications.map(n => 
                    n.noti_id === id ? { ...n, is_read: true } : n
                );
                const unreadCount = notifications.filter(n => !n.is_read).length;
                return { notifications, unreadCount };
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    },

    markAllAsRead: async () => {
        try {
            await axiosInstance.put('/notifications/read-all');
            set(state => {
                const notifications = state.notifications.map(n => ({ ...n, is_read: true }));
                return { notifications, unreadCount: 0 };
            });
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }
}));

export default useNotificationStore;
