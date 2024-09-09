import axios from 'axios';

const API_URL = 'http://localhost:8080/users';

// Fetch all Users
export const getUsers = () => axios.get(API_URL);

//Fetch User by ID
export const getUser = (userId) => axios.get(`${API_URL}/${userId}`);


// Save a new User
export const saveUser = (user) => axios.post(API_URL, user);

// Update an existing User
export const updateUser = (user) => axios.put(`${API_URL}/${user.id}`, user);

// Delete a User
export const deleteUser = (userId) => axios.delete(`${API_URL}/${userId}`);
