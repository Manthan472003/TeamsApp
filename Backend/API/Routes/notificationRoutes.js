const express = require('express');
const router = express.Router();
const notificationController =  require('../Controllers/notificationController');

// Route for creating a new notification
router.post('/', notificationController.createNotification);

// Route for getting all notifications
router.get('/', notificationController.getAllNotifications);

// Route for getting a notification by ID
router.get('/:id', notificationController.getNotificationById);

// Route for deleting a notification by ID
router.delete('/:id', notificationController.deleteNotificationById);

//Route for getting notifications for a user by User ID
router.get('/users/:userId', notificationController.getNotificationsByUserId);

module.exports = router;
