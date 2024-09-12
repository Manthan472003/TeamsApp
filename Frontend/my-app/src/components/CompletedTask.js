import React, { useEffect, useState } from 'react';
import { getCompletedTasks } from '../Services/TaskService'; // Adjust the import path as needed

const CompletedTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getCompletedTasks();
        setTasks(response.data); // Set the tasks from the API response
      } catch (err) {
        setError('Failed to fetch completed tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Completed Tasks</h2>
      {tasks.length === 0 ? (
        <p>No completed tasks found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              {/* Add other task details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedTask;
