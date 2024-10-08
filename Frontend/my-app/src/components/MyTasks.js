import React, { useEffect, useState } from 'react';
import { getAssignedTasks } from '../Services/TaskService';
import { getSections } from '../Services/SectionService';
import { Heading, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Text, Spacer } from '@chakra-ui/react';
import MyTasksTable from './MyTasksTable';
import jwt_decode from 'jwt-decode';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  const [tasksBySection, setTasksBySection] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserId(decoded.id);
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
      if (!userId) return;

      try {
        const response = await getAssignedTasks(userId);
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching assigned tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await getSections();
        setSections(response.data);
      } catch (error) {
        console.error('Fetch Sections Error:', error);
        setError('Failed to load sections');
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    const groupedTasks = {};
    tasks.forEach(task => {
      const sectionId = task.sectionID || 'no-section';
      if (!groupedTasks[sectionId]) {
        groupedTasks[sectionId] = [];
      }
      groupedTasks[sectionId].push(task);
    });
    setTasksBySection(groupedTasks);
  }, [tasks]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Modify filterTasks to exclude completed and soft deleted tasks
  const filterTasks = (tasks) => {
    return tasks.filter(task => task.status !== 'Completed' && !task.isDelete); // Assume isDeleted is the property for soft deletion
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

      <Accordion mt={3} allowToggle>
        {sections.map(section => {
          const sectionTasks = tasksBySection[section.id] || [];
          const filteredTasks = filterTasks(sectionTasks); // Filter the tasks for this section
          if (filteredTasks.length === 0) return null; // Skip rendering this section if no valid tasks

          return (
            <AccordionItem key={section.id} borderWidth={1} borderRadius="md" mb={4}>
              <AccordionButton>
                <Box flex='1' textAlign='left'>
                  <Text fontSize='xl' fontWeight='bold' color='#149edf'>{section.sectionName}</Text>
                  <Text fontSize='md' color='gray.500'>{section.description}</Text>
                </Box>
                <Spacer />
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <MyTasksTable tasks={filteredTasks} users={[]} />
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Box>
  );
};

export default MyTasks;