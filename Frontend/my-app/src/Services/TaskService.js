// TaskService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/tasks';

// Fetch all tasks
export const getTasks = () => axios.get(API_URL);

// Fetch tasks for a specific section
export const getTasksBySection = (sectionId) => axios.get(`${API_URL}/section/${sectionId}`);

// Save a new task
export const saveTask = (task) => axios.post(API_URL, task);

// Update an existing task
export const updateTask = async (task) => {
    try {
        const response = await axios.put(`${API_URL}/${task.id}`, task);
        return response.data; // Return the updated task
    } catch (error) {
        console.error('Failed to update task:', error.response ? error.response.data : error.message);
        throw error; // Rethrow error to be handled by the caller
    }
};

// Delete a task
export const deleteTask = (taskId) => axios.delete(`${API_URL}/${taskId}`);
