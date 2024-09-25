import axios from 'axios';

const API_URL = 'http://localhost:8080/tags'; 

// Fetch all Tags
export const getTags = () => axios.get(API_URL);

// Save a new Tag
export const saveTag = (tag) => axios.post(API_URL, tag);

// Update an existing Tag
export const updateTag = (tag) => axios.put(`${API_URL}/${tag.id}`, tag);

// Delete a Tag
export const deleteTag = (tagId) => axios.delete(`${API_URL}/${tagId}`);

//Remove a Tag from Task
export const removeTagFromTask = (tagId,taskId) => axios.delete(`${API_URL}/${tagId}/tasks/${taskId}`);