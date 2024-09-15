import React, { useEffect, useState } from 'react';
import { getAssignedTasks } from '../Services/TaskService'; // Adjust the import based on your file structure
import { Heading } from '@chakra-ui/react';
import MyTasksTable from './MyTasksTable'; // Adjust the import based on your file structure

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAssignedTasks(userId);
        setTasks(response.data); // Assuming response.data contains the tasks array
      } catch (err) {
        console.error('Error fetching assigned tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTasks();
    } else {
      setLoading(false);
      setError('User not logged in');
    }
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
    <div>
            <Heading as='h2' size='xl' paddingLeft={3} color={'#086F83'}>
                My Tasks
            </Heading>      
            <MyTasksTable tasks={filterTasks(tasks)} users={[]} /> {/* Pass tasks to the table */}
    </div>
  );
};

export default MyTasks;
