const Notification = require('../../Database/Models/notifications');
const User = require('../../Database/Models/user');
const { Op } = require('sequelize');
const sequelize = require('../../Database/Config/config');

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
                    id: {
                        [Op.in]: userIds
                    }
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
        console.error('Error creating notification:', error);
        return res.status(500).json({ message: 'Error creating notification.', error });
    }
};

// Get all notifications
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        return res.status(500).json({ message: 'Error retrieving notifications.', error });
    }
};

// Get notification by ID 
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
        console.error('Error retrieving notification:', error);
        return res.status(500).json({ message: 'Error retrieving notification.', error });
    }
};

// Delete notification by ID
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
        console.error('Error deleting notification:', error);
        return res.status(500).json({ message: 'Error deleting notification.', error });
    }
};

// Get all notifications by UserID
const getNotificationsByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10); // Convert to number

        // Use a raw SQL query to search within userIds
        const notifications = await sequelize.query(
            'SELECT * FROM notifications_table WHERE JSON_CONTAINS(userIds, ?)',
            {
                replacements: [JSON.stringify(userId)], // Wrap userId in JSON.stringify
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found.' });
        }

        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Error retrieving notifications for user:', error);
        return res.status(500).json({ message: 'Error retrieving notifications for user.', error });
    }
};

const seenTheNotificationByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const notificationId = parseInt(req.params.notificationId, 10); // Assuming notification ID is passed in the URL

        // Check if userId and notificationId are valid numbers
        if (isNaN(userId) || isNaN(notificationId)) {
            return res.status(400).json({ message: 'Invalid userId or notificationId' });
        }

        console.log(`User ID: ${userId}, Notification ID: ${notificationId}`); // Debug log

        // Find the notification by its ID
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Check if userId is already in notificationSeenByUserIds
        if (!notification.notificationSeenByUserIds.includes(userId)) {
            // Add userId to the array
            notification.notificationSeenByUserIds.push(userId);
        } else {
            return res.status(200).json({ message: 'Notification already marked as seen' });
        }

        // Update the notification
        await Notification.update(
            { notificationSeenByUserIds: notification.notificationSeenByUserIds },
            { where: { id: notificationId } }
        );

        return res.status(200).json({ message: 'Notification marked as seen', notification });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getCountOfUnreadNotificationsByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid userId' });
        }

        // Count notifications where userId is in userIds but not in notificationSeenByUserIds
        const count = await Notification.count({
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('JSON_CONTAINS', sequelize.col('userIds'), JSON.stringify(userId)), true), // userId exists in userIds
                    sequelize.where(sequelize.fn('JSON_CONTAINS', sequelize.col('notificationSeenByUserIds'), JSON.stringify(userId)), false) // userId does not exist in notificationSeenByUserIds
                ]
            }
        });

        return res.status(200).json({ count });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const getUnreadNotificationsByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10); // Convert to number

        const unseenNotifications = await Notification.findAll({
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('JSON_CONTAINS', sequelize.col('userIds'), JSON.stringify(userId)), true), // userId exists in userIds
                    sequelize.where(sequelize.fn('JSON_CONTAINS', sequelize.col('notificationSeenByUserIds'), JSON.stringify(userId)), false) // userId does not exist in notificationSeenByUserIds
                ]
            }
        });

        // Send the results back to the client
        res.status(200).json(unseenNotifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching notifications.' });
    }
};



module.exports = {
    createNotification,
    getNotificationById,
    getAllNotifications,
    deleteNotificationById,
    getNotificationsByUserId,
    seenTheNotificationByUserId,
    getCountOfUnreadNotificationsByUserId,
    getUnreadNotificationsByUserId
};