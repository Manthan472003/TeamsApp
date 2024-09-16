import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:8080/dailyReports';

// Create a new Daily Report
export const createDailyReport = async ({ taskName, status }) => {
    try {
      const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
  
      if (!userId) {
        throw new Error('User ID is missing from localStorage.');
      }
  
      const response = await axios.post('http://localhost:8080/dailyReports', {
        userId, 
        taskName,
        status,
      });
  
      return response.data;
    } catch (error) {
      console.error('Error creating daily report:', error); // Detailed error logging
      throw error;
    }
  };
  
  // Get all Daily Reports
  export const getAllReports = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily reports:', error);
      throw error;
    }
  };

// Get daily report by ID
export const getDailyReportById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching daily report by ID:', error);
    throw error;
  }
};

// Delete daily report by ID
export const deleteDailyReportById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting daily report:', error);
    throw error;
  }
};

// Get daily reports by user ID
export const getDailyReportsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching daily reports by user ID:', error);
    throw error;
  }
};
