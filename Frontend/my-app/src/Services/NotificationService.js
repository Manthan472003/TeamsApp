import axios from 'axios';

// Base URL for API endpoints
const API_URL = 'http://localhost:8080/notifications';

// Fetch all notifications
export const getNotification = () => axios.get(API_URL);