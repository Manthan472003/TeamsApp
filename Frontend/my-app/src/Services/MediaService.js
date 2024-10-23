import axios from 'axios';

const API_URL = 'http://localhost:8080/media';

// Fetch all Media
export const getAllMedia = () => axios.get(API_URL);

// Fetch Media By Task ID
export const getMediaOfTheTaskorBuild = (type, taskId) => axios.get(`${API_URL}/${type}/${taskId}/media`);

// Fetch Media By ID
export const getMediaById = (mediaId) => axios.get(`${API_URL}/${mediaId}`);

// Upload Media
export const createMedia = async (type, taskId, mediaFiles) => {
  const formData = new FormData();
  mediaFiles.forEach(file => {
    formData.append('mediaFiles', file); 
  });

  try {
    const response = await axios.post(`${API_URL}/${type}/${taskId}/media`, formData);
    return response.data; 
  } catch (error) {
    console.error('Error uploading media:', error.response ? error.response.data : error.message);
    throw error; 
  }
};

// Delete a media
export const deleteMedia = (mediaId) => axios.delete(`${API_URL}/${mediaId}`);
