import axios from 'axios';

const API_URL = 'http://localhost:8080/media'; 

// Fetch all Media for a specific task
export const getMedias = async (taskId) => {
  if (!taskId) {
    console.error("No task ID provided for fetching media.");
    throw new Error("Task ID is required to fetch media.");
  }

  try {
    const response = await axios.get(`${API_URL}?taskId=${taskId}`);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching media:", error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to be handled later
  }
};

// Save a new media
export const saveMedia = async (media) => {
  if (!media || !(media instanceof FormData)) {
    console.error("Invalid media format. FormData is required.");
    throw new Error("Invalid media. Please provide a valid FormData object.");
  }

  try {
    const response = await axios.post(API_URL, media);
    return response.data; // Return the data of the saved media
  } catch (error) {
    console.error("Error saving media:", error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to be handled later
  }
};

// Delete a media
export const deleteMedia = async (mediaId) => {
  if (!mediaId) {
    console.error("No media ID provided for deletion.");
    throw new Error("Media ID is required to delete media.");
  }

  try {
    const response = await axios.delete(`${API_URL}/${mediaId}`);
    return response.data; // Return the data of the deleted media
  } catch (error) {
    console.error("Error deleting media:", error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to be handled later
  }
};
