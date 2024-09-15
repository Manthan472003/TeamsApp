import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast, Spacer, Heading
} from '@chakra-ui/react';

import { getSections } from '../Services/SectionService';
import { getCompletedTasks, getTasksBySection, updateTask } from '../Services/TaskService';
import { getUsers } from '../Services/UserService'; // Import the getUsers function
import CompletedTaskTable from './CompletedTaskTable';

const CompletedTask = () => {
    const [sections, setSections] = useState([]);
    const [tasksBySection, setTasksBySection] = useState({});
    const [users, setUsers] = useState([]); // Ensure users are also fetched and managed
    const [selectedSectionId, setSelectedSectionId] = useState(null);

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
            setTasksBySection(prev => ({ ...prev, 'no-section': response.data }));
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
            setTasksBySection(prev => ({ ...prev, [sectionId]: response.data }));
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
            const response = await getUsers(); // Assuming getUsers function is available
            setUsers(response.data); // Assuming response.data contains the array of users
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
        fetchCompletedTasks(); // Fetch completed tasks initially
        fetchUsers(); // Fetch users
    }, [fetchSections, fetchCompletedTasks, fetchUsers]);

    useEffect(() => {
        if (selectedSectionId) {
            fetchTasksBySection(selectedSectionId);
        }
    }, [selectedSectionId, fetchTasksBySection]);

    // Filter only completed tasks
    const getCompletedTasksForSection = (sectionId) => {
        return (tasksBySection[sectionId] || []).filter(task => task.status === 'Completed');
    };

    const getCompletedTasksForNoSection = () => {
        return (tasksBySection['no-section'] || []).filter(task => task.status === 'Completed');
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const taskToUpdate = Object.values(tasksBySection).flat().find(task => task.id === taskId);
            if (taskToUpdate) {
                taskToUpdate.status = newStatus;
                await updateTask(taskToUpdate); // Update task status in the backend
                if (taskToUpdate.sectionID !== null) {
                    await fetchTasksBySection(taskToUpdate.sectionID); // Refresh tasks for the specific section
                } else {
                    await getCompletedTasksForNoSection(); // Refresh tasks without section
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
            <Heading as='h2' size='xl'paddingLeft={3} color={'#086F83'}>
                Completed Tasks
            </Heading>
            <br/>
            <Accordion>
                {sections.map(section => (
                    <AccordionItem key={section.id} borderWidth={1} borderRadius="md" mb={4}>
                        <AccordionButton onClick={() => setSelectedSectionId(section.id)}>
                            <Box flex='1' textAlign='left'>
                                <Text fontSize='xl' fontWeight='bold' color='#149edf'>{section.sectionName}</Text>
                                <Text fontSize='md' color='gray.500'>{section.description}</Text>
                            </Box>
                            <Spacer />
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <CompletedTaskTable
                                tasks={getCompletedTasksForSection(section.id)}
                                users={users} // Pass users to CompletedTaskTable
                                onStatusChange={handleStatusChange} // Ensure this is defined

                            />
                        </AccordionPanel>
                    </AccordionItem>
                ))}

                {/* "Others" Section */}
                <AccordionItem borderWidth={1} borderRadius="md" mb={4}>
                    <AccordionButton>
                        <Box flex='1' textAlign='left'>
                            <Text fontSize='xl' fontWeight='bold' color='#149edf'>Others</Text>
                            <Text fontSize='md' color='gray.500'>Tasks without a specific section</Text>
                        </Box>
                        <Spacer />
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <CompletedTaskTable
                            tasks={getCompletedTasksForNoSection()}
                            users={users} // Pass users to CompletedTaskTable
                            onStatusChange={handleStatusChange} // Ensure this is defined

                        />
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Box>
    );
};

export default CompletedTask;
