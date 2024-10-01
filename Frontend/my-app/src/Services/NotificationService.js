import axios from 'axios';

// Base URL for API endpoints
const API_URL = 'http://localhost:8080/notifications';

// Fetch all notifications
export const getNotifications = () => axios.get(API_URL);

//Get Notification By ID
export const getNotificationById = (notificationId) => axios.get(`${API_URL}/${notificationId}`)

//Get Notifications By User ID
export const getNotificationsByUserId = (userId) => axios.get(`${API_URL}/users/${userId}`)
