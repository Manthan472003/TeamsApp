import axios from 'axios';

const API_URL = 'http://localhost:8080/appVersionManagement';

//Create new AVM Entry
export const createNewAppVersionManagementEntry = (avmEntry) => axios.post(API_URL, avmEntry);

//Fetch all AVM Entries
export const getAllAppVersionManagementEntries = () => axios.get(API_URL);

//Fetch AVM Entry by ID
export const getAppVersionManagementEntryByID = (avmId) => axios.get(`${API_URL}/${avmId}`);

// Delete a AVM Entry by ID
export const deleteAppVersionManagementEntryByID = (avmId) => axios.delete(`${API_URL}/${avmId}`);

// Update an existing AVM Entry
export const updateAppVersionManagementEntryByID = async (avmEntry) => {
    try {
        const response = await axios.put(`${API_URL}/${avmEntry.id}`, avmEntry);
        return response.data;
    } catch (error) {
        console.error('Failed to update AVM Entry:', error.response ? error.response.data : error.message);
        throw error;
    }
};

//Version Accepted by Id
export const  versionAcceptedById = async (avmId) => axios.put(`${API_URL}/versionAccepted/${avmId}`);
