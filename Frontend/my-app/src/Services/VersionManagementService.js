import axios from 'axios';

const API_URL = 'http://localhost:8080/versionManagement';

//Fetch all Version Management Entries
export const getAllVersionManagementEntries = () => axios.get(API_URL);

//Create new Version Management Entry
export const createNewVersionManagementEntry = (vmEntry) => axios.post(API_URL, vmEntry);

//Fetch Version Management Entry by ID
export const getVersionManagementEntryByID = (vmId) => axios.get(`${API_URL}/${vmId}`);

// Delete a Version Management Entry by ID
export const deleteVersionManagementEntryByID = (vmId) => axios.delete(`${API_URL}/${vmId}`);
   
// Update an existing Version Management Entry
export const updateVersionManagementEntryByID = async (vmEntry) => {
    try {
        const response = await axios.put(`${API_URL}/${vmEntry.id}`, vmEntry);
        return response.data;
    } catch (error) {
        console.error('Failed to update VM Entry:', error.response ? error.response.data : error.message);
        throw error;
    }
};

//Fetch all Version Management Entries by User ID
export const getAllVersionManagementEntriesByUserID = (userId) => axios.get(`${API_URL}/user/${userId}`);