const Notification = require('../../Database/Models/notifications');
const User = require('../../Database/Models/user');

// Create a new notification
const createNotification = async (req, res) => {
    try {
        const { notificationText, userIds } = req.body;
        if (!notificationText) {
            return res.status(400).json({ message: 'Notification Text is required.' });
        }

        // Validate userIDs if provided
        if (userIds && Array.isArray(userIds)) {
            const users = await User.findAll({
                where: {
                    id: userIds
                }
            });

            const userIdsInDb = users.map(user => user.id);
            const invalidUserIds = userIds.filter(userId => !userIdsInDb.includes(userId));

            if (invalidUserIds.length > 0) {
                return res.status(404).json({ message: `User with IDs ${invalidUserIds.join(', ')} do not exist.` });
            }
        }

        // Create the new notification
        const newNotification = await Notification.create({ notificationText, userIds });
        return res.status(201).json({ message: 'Notification created successfully.', newNotification });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating tag.', error });
    }
};

// Get all tags
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving notifications.', error });
    }
};

// Get tag by ID 
const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOne({
            where: { id }
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }
        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving notification.', error });
    }
};

// Delete tag by ID
const deleteNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOne({
            where: { id }
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }
        await notification.destroy();
        return res.status(200).json({ message: 'Notification deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting Notification.', error });
    }
};

module.exports = {
    createNotification,
    getNotificationById,
    getAllNotifications,
    deleteNotificationById
}