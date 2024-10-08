import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:8080/dailyReports';

//Fetch all Daily Reports
export const getAllReports = () => axios.get(API_URL);


// Create a new Daily Report
export const createDailyReport = (report) => axios.post(API_URL, report);
 
//Fetch Report by ID
export const getReportByID = (reportId) => axios.get(`${API_URL}/${reportId}`);

// Delete daily report by ID
export const deleteDailyReportById = (reportId) => axios.delete(`${API_URL}/${reportId}`);

// Get daily reports by user ID
export const getAllReportsByUserID = (userId) => axios.get(`${API_URL}/user/${userId}`);
