import axios from 'axios';

// Base URL for API endpoints
const API_URL = 'http://localhost:8080/notifications';

// Fetch all notifications
export const getNotifications = () => axios.get(API_URL);

// Get Notification By ID
export const getNotificationById = (notificationId) => axios.get(`${API_URL}/${notificationId}`);

// Get Notifications By User ID
export const getNotificationsByUserId = (userId) => axios.get(`${API_URL}/users/${userId}`);

// Create a new notification
export const createNotification = async ({ notificationText, userIds }) => {
    try {
        const response = await axios.post(API_URL, {
            notificationText,
            userIds,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating notification:', error.response ? error.response.data : error.message);
        throw error;
    }
};

//Mark Notification Seen for a user
export const markNotificationSeen = async ( notificationId, userId ) => {
    try {
        const response = await axios.put(`${API_URL}/${notificationId}/markAsSeen/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error marking notification seen:', error.response ? error.response.data : error.message);
        throw error;
    }
}

//Get Count of unread notifications
export const getUnreadNotificationsCount = async (userId) => axios.get(`${API_URL}/count/unread/${userId}`);

//Get Unread Notifications by UserId
export const getUnreadNotifications = async (userId) => axios.get(`${API_URL}/unseenNotifications/${userId}`);