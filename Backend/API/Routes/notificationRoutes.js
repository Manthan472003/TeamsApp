const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');
const Notification = require('../../Database/Models/notifications'); // Adjust the path as necessary
const User = require('../../Database/Models/user'); // Adjust the path to your User model

// Route for creating a new notification
router.post('/', async (req, res) => {
    const { notificationText, userIds } = req.body;

    try {
        // Validate user IDs (ensure users exist)
        const existingUsers = await User.findAll({
            where: {
                id: userIds,
            },
        });

        if (existingUsers.length !== userIds.length) {
            return res.status(400).json({ message: `User with IDs ${userIds.filter(id => !existingUsers.map(user => user.id).includes(id)).join(', ')} do not exist.` });
        }

        // Create notification
        const notification = await Notification.create({ notificationText, userIds });
        return res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
// Route for getting all notifications
router.get('/', notificationController.getAllNotifications);

// Route for getting a notification by ID
router.get('/:id', notificationController.getNotificationById);

// Route for deleting a notification by ID
router.delete('/:id', notificationController.deleteNotificationById);

// Route for getting notifications for a user by User ID
router.get('/users/:userId', notificationController.getNotificationsByUserId);

//Mark Notification as seen
router.put('/:notificationId/markAsSeen/:userId', notificationController.seenTheNotificationByUserId);

//Get Count of unread notifications
router.get('/count/unread/:userId', notificationController.getCountOfUnreadNotificationsByUserId);

//Get Unread Notifications By UserId
router.get('/unseenNotifications/:userId',notificationController.getUnreadNotificationsByUserId);

module.exports = router;