import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '../components/Header';
import TaskManager from '../components/TaskManager';
import { getTasks, deleteTask } from '../Services/TaskService';

const Home = () => {
  const [tasks, setTasks] = useState([]);
 
  useEffect(() => {
    const fetchTasks = async () => {
        try {
            const response = await getTasks();
            setTasks(response.data);
        } catch (error) {
            console.error('There was an error fetching tasks!', error);
        }
    };

    fetchTasks();
}, []);

  const handleDeleteTask = (task) => {
    if (window.confirm(`Are you sure you want to delete the task "${task.taskName}"?`)) {
      deleteTask(task.id)
        .then(() => {
          setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id)); // Ensure immutable state update
        })
        .catch(error => console.error('There was an error deleting the task!', error));
    }
  };

  return (
    <Box defaultValue={[0]}>
      <Header />     
      <Box mt={6} p={4}>
        <TaskManager
          tasks={tasks}
          onDelete={handleDeleteTask}
        />
      </Box>
    </Box>
  );
};

export default Home;