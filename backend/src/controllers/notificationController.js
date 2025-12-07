import * as NotificationModel from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    const userId = req.user.user_id;
    try {
        const notifications = await NotificationModel.getNotificationsByUserId(userId);
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

export const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        await NotificationModel.markAsRead(id);
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating notification' });
    }
};

export const markAllAsRead = async (req, res) => {
    const userId = req.user.user_id;
    try {
        await NotificationModel.markAllAsRead(userId);
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating notifications' });
    }
};
