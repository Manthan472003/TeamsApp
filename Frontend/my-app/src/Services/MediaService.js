import axios from 'axios';

const API_URL = 'http://localhost:8080/media'; 

// Fetch all Media
export const getMedias = () => axios.get(API_URL);

// Save a new Tag
export const saveMedia = (media) => axios.post(API_URL, media);

// Delete a Tag
export const deleteMedia = (mediaId) => axios.delete(`${API_URL}/${mediaId}`);