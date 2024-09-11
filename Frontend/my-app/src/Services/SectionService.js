import axios from 'axios';

const API_URL = 'http://localhost:8080/sections';

// Fetch all sections
export const getSections = async () => {
    try {
        const response = await axios.get(API_URL);
        return response; // Expecting an array of sections
    } catch (error) {
        console.error('Error fetching sections:', error);
        throw new Error('Failed to fetch sections');
    }
};

// Save a new section
export const saveSection = async (sectionData) => {
    try {
        const response = await axios.post(API_URL, sectionData);
        return response;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 409) {
                throw new Error('Section already exists');
            }
            throw new Error(`Error: ${error.response.status} - ${error.response.data.message}`);
        } else if (error.request) {
            throw new Error('Network error: No response received');
        } else {
            throw new Error('Error setting up the request');
        }
    }
};


// Delete a section
export const deleteSection = async (sectionId) => {
    try {
        const response = await axios.delete(`${API_URL}/${sectionId}`);
        return response;
    } catch (error) {
        console.error('Error deleting section:', error);
        throw new Error('Failed to delete section');
    }
};

// Update an existing Section
export const updateSection = (section) => axios.put(`${API_URL}/${section.id}`, {
    sectionName : section.sectionName
});
