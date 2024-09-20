import axios from 'axios';

const BASE_URL = 'http://localhost:8080/media'; 

// Fetch all Media for a specific task
export const getMedias = async (taskId) => {
  if (!taskId) {
    console.error("No task ID provided for fetching media.");
    throw new Error("Task ID is required to fetch media.");
  }

  try {
    const response = await axios.get(`${BASE_URL}?taskId=${taskId}`);
    return response.data; // Return the data directly
  } catch (error) {
    const message = error.response 
      ? error.response.data.message || error.message 
      : "Network Error";
    console.error("Error fetching media:", message);
    throw new Error(message); // Re-throw the error to be handled later
  }
};

// Save a new media
export const saveMedia = async (taskId, media) => {
  if (!media || !(media instanceof FormData)) {
    console.error("Invalid media format. FormData is required.");
    throw new Error("Invalid media. Please provide a valid FormData object.");
  }

  try {
    const response = await axios.post(`${BASE_URL}/tasks/${taskId}/media`, media);
    return response.data; // Return the data of the saved media
  } catch (error) {
    const message = error.response 
      ? error.response.data.message || error.message 
      : "Network Error";
    console.error("Error saving media:", message);
    throw new Error(message); // Re-throw the error to be handled later
  }
};

// Delete a media
export const deleteMedia = async (mediaId) => {
  if (!mediaId) {
    console.error("No media ID provided for deletion.");
    throw new Error("Media ID is required to delete media.");
  }

  try {
    const response = await axios.delete(`${BASE_URL}/${mediaId}`);
    return response.data; // Return the data of the deleted media
  } catch (error) {
    const message = error.response 
      ? error.response.data.message || error.message 
      : "Network Error";
    console.error("Error deleting media:", message);
    throw new Error(message); // Re-throw the error to be handled later
  }
};
