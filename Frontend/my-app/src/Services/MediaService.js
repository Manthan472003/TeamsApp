import axios from 'axios';

const API_URL = 'http://localhost:8080/media';

// Fetch all Media
export const getAllMedia = () => axios.get(API_URL);

// Fetch Media By Task ID
export const getMediaOfTheTask = (taskId) => axios.get(`${API_URL}/tasks/${taskId}/media`);

// Fetch Media By ID
export const getMediaById = (mediaId) => axios.get(`${API_URL}/${mediaId}`);

// Upload Media
export const createMedia = async (taskId, mediaFiles) => {
  const formData = new FormData();
  mediaFiles.forEach(file => {
    formData.append('mediaFiles', file); // Use 'mediaFiles' as the key
  });

  try {
    const response = await axios.post(`${API_URL}/tasks/${taskId}/media`, formData);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error uploading media:', error.response ? error.response.data : error.message);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

// Delete a media
export const deleteMedia = (mediaId) => axios.delete(`${API_URL}/${mediaId}`);
