import axios from 'axios';

const API_URL = 'http://localhost:8080/users';

// Fetch all Users
export const getUsers = () => axios.get(API_URL);

// Fetch User by ID
export const getUser = (userId) => axios.get(`${API_URL}/${userId}`);

// Save a new User
export const saveUser = (user) => axios.post(API_URL, user);

// Update an existing User (allowing partial updates)
export const updateUser = (userId, user) => {
    return axios.put(`${API_URL}/${userId}`, user);
};

// Delete a User
export const deleteUser = (userId) => axios.delete(`${API_URL}/${userId}`);

// Login user
export const loginUser = (email, password) => axios.post(`${API_URL}/login`, { email, password });