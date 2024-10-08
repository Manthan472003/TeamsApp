import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast, Spacer, Heading
} from '@chakra-ui/react';

import { getSections } from '../Services/SectionService';
import { getCompletedTasks, getTasksBySection, updateTask } from '../Services/TaskService';
import { getUsers } from '../Services/UserService';
import CompletedTaskTable from './CompletedTaskTable';
import SearchBar from './SearchBar'; // Import the SearchBar component

const CompletedTask = () => {
    const [sections, setSections] = useState([]);
    const [tasksBySection, setTasksBySection] = useState({});
    const [completedTasks, setCompletedTasks] = useState([]); // New state for completed tasks
    const [users, setUsers] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [selectedTask, setSelectedTask] = useState(null); // State for selected task

    const toast = useToast();

    // Fetch sections
    const fetchSections = useCallback(async () => {
        try {
            const response = await getSections();
            setSections(response.data);
        } catch (error) {
            console.error('Fetch Sections Error:', error);
            toast({
                title: "Error fetching sections.",
                description: "Unable to fetch sections. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]);

    // Fetch completed tasks
    const fetchCompletedTasks = useCallback(async () => {
        try {
            const response = await getCompletedTasks();
            const completed = response.data.filter(task => task.status === 'Completed' && !task.isDelete);
            setCompletedTasks(completed); // Store completed tasks
            setTasksBySection(prev => ({ ...prev, 'no-section': completed })); // Initialize tasks by section
        } catch (error) {
            console.error('Fetch Completed Tasks Error:', error);
            toast({
                title: "Error fetching completed tasks.",
                description: "Unable to fetch completed tasks. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]);

    // Fetch tasks by section
    const fetchTasksBySection = useCallback(async (sectionId) => {
        try {
            const response = await getTasksBySection(sectionId);
            const completed = response.data.filter(task => task.status === 'Completed' && !task.isDelete);
            setTasksBySection(prev => ({ ...prev, [sectionId]: completed })); // Store completed tasks by section
        } catch (error) {
            console.error('Fetch Tasks Error:', error);
            toast({
                title: "Error fetching tasks.",
                description: "Unable to fetch tasks. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        try {
            const response = await getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Fetch Users Error:', error);
            toast({
                title: "Error fetching users.",
                description: "Unable to fetch users. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]);

    useEffect(() => {
        fetchSections();
        fetchCompletedTasks();
        fetchUsers();
    }, [fetchSections, fetchCompletedTasks, fetchUsers]);

    useEffect(() => {
        if (selectedSectionId) {
            fetchTasksBySection(selectedSectionId);
        }
    }, [selectedSectionId, fetchTasksBySection]);

    // Handle section selection from the search bar
    const handleSectionSelect = (section) => {
        setSelectedSectionId(section.id); // Set the selected section
        setSelectedTask(null); // Clear any previously selected task
    };

    const handleTaskSelect = (task) => {
        setSelectedTask(task); // Set the selected task
        setSelectedSectionId(task.sectionID); // Automatically open the section containing the task
    };

    // Filter only completed tasks based on search query
    const getCompletedTasksForSection = (sectionId) => {
        return (tasksBySection[sectionId] || []).filter(task =>
            task.status === 'Completed' && !task.isDelete && task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const taskToUpdate = Object.values(tasksBySection).flat().find(task => task.id === taskId);
            if (taskToUpdate) {
                taskToUpdate.status = newStatus;
                await updateTask(taskToUpdate);
                if (taskToUpdate.sectionID !== null) {
                    await fetchTasksBySection(taskToUpdate.sectionID);
                } else {
                    await fetchCompletedTasks();
                }
                toast({
                    title: "Task status updated.",
                    description: `Task status has been updated to ${newStatus}.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error updating task status:', error);
            toast({
                title: "Error updating task status.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box mt={5}>
            <Heading as='h2' size='xl' paddingLeft={3} mb={3} sx={{
                background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
            }}>
                Completed Tasks
            </Heading>
            <SearchBar
                onApplyFilter={setSearchQuery}
                tasks={completedTasks}
                sections={sections} // Pass the sections to the search bar
                onTaskSelected={handleTaskSelect} // Task selection handler
                onSectionSelected={handleSectionSelect} // Section selection handler
            />
            <br />
            <Accordion allowToggle>
                {sections.map(section => (
                    <AccordionItem key={section.id} borderWidth={1} borderRadius="md" mb={4}>
                        <AccordionButton onClick={() => setSelectedSectionId(selectedSectionId === section.id ? null : section.id)}>
                            <Box flex='1' textAlign='left'>
                                <Text fontSize='xl' fontWeight='bold' color='#149edf'>{section.sectionName}</Text>
                                <Text fontSize='md' color='gray.500'>{section.description}</Text>
                            </Box>
                            <Spacer />
                            <AccordionIcon />
                        </AccordionButton>
                        {selectedSectionId === section.id && (
                            <AccordionPanel pb={4}>
                                {/* Show only selected task if a task is selected */}
                                {selectedTask && selectedTask.sectionID === section.id ? (
                                    <CompletedTaskTable
                                        tasks={[selectedTask]} // Show only the selected task
                                        users={users}
                                        onStatusChange={handleStatusChange}
                                    />
                                ) : (
                                    <CompletedTaskTable
                                        tasks={getCompletedTasksForSection(section.id)} // Show all tasks in this section
                                        users={users}
                                        onStatusChange={handleStatusChange}
                                    />
                                )}
                            </AccordionPanel>
                        )}
                    </AccordionItem>
                ))}
            </Accordion>
        </Box>
    );
};

export default CompletedTask;
