import axios from 'axios';

const API_URL = 'http://localhost:8080/tasks';

// Fetch all tasks
export const getTasks = () => axios.get(API_URL);

// Save a new task
export const saveTask = (task) => axios.post(API_URL, task);

// Update an existing task
export const updateTask = (task) => axios.put(`${API_URL}/${task.id}`, task);

// Delete a task
export const deleteTask = (taskId) => axios.delete(`${API_URL}/${taskId}`);
