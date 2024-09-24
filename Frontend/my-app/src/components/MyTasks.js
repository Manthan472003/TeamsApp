import React, { useEffect, useState } from 'react';
import { getAssignedTasks } from '../Services/TaskService'; // Adjust the import based on your file structure
import { Heading, Box } from '@chakra-ui/react';
import MyTasksTable from './MyTasksTable'; // Adjust the import based on your file structure
import jwt_decode from 'jwt-decode'; // Import jwt-decode

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    console.log('Token:', token); // Log the token

    if (token) {
      try {
        const decoded = jwt_decode(token); // Decode the JWT token
        setUserId(decoded.id); // Set the userId from the token
        console.log('Decoded User ID:', decoded.id); // Log the decoded user ID
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Invalid token');
      }
    } else {
      setLoading(false);
      setError('User not logged in');
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) return; // If userId is not set, return early

      try {
        const response = await getAssignedTasks(userId);
        console.log('Fetched Tasks:', response.data); // Log the fetched tasks
        setTasks(response.data); // Assuming response.data contains the tasks array
      } catch (err) {
        console.error('Error fetching assigned tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filterTasks = (tasks) => {
    return tasks.filter(task => task.status !== 'Completed');
  };

  return (
    <Box mt={5}>
      <Heading as='h2' size='xl' paddingLeft={3} sx={{
          background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
          backgroundClip: 'text',
          color: 'transparent',
          display: 'inline-block',
      }}>
        My Tasks
      </Heading>      
      <MyTasksTable tasks={filterTasks(tasks)} users={[]} /> {/* Pass tasks to the table */}
    </Box>
  );
};

export default MyTasks;
