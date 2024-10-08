import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast, Spacer, Heading
} from '@chakra-ui/react';

import { getSections } from '../Services/SectionService';
import { getCompletedTasks, getTasksBySection, updateTask } from '../Services/TaskService';
import { getUsers } from '../Services/UserService';
import CompletedTaskTable from './CompletedTaskTable';
import SearchBar from './SearchBar';

const CompletedTask = () => {
    const [sections, setSections] = useState([]);
    const [tasksBySection, setTasksBySection] = useState({});
    const [completedTasks, setCompletedTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(''); // State for selected user filter
    const [selectedTask, setSelectedTask] = useState(null);

    const toast = useToast();

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

    const fetchCompletedTasks = useCallback(async () => {
        try {
            const response = await getCompletedTasks();
            const completed = response.data.filter(task => task.status === 'Completed' && !task.isDelete);
            setCompletedTasks(completed);
            setTasksBySection(prev => ({ ...prev, 'no-section': completed }));
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

    const fetchTasksBySection = useCallback(async (sectionId) => {
        try {
            const response = await getTasksBySection(sectionId);
            const completed = response.data.filter(task => task.status === 'Completed' && !task.isDelete);
            setTasksBySection(prev => ({ ...prev, [sectionId]: completed }));
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

    const handleSectionSelect = (section) => {
        setSelectedSectionId(section.id);
        setSelectedTask(null);
    };

    const handleTaskSelect = (task) => {
        setSelectedTask(task);
        setSelectedSectionId(task.sectionID);
    };

    const getCompletedTasksForSection = (sectionId) => {
        return (tasksBySection[sectionId] || []).filter(task => {
            const matchesSearch = task.taskName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesUser = selectedUser ? task.userId === selectedUser : true; // Assuming task has a userId
            return task.status === 'Completed' && !task.isDelete && matchesSearch && matchesUser;
        });
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

    const filteredSections = sections.filter(section => {
        const tasksInSection = tasksBySection[section.id] || [];
        return tasksInSection.some(task => 
            task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

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
                onApplyFilter={(query, user) => {
                    setSearchQuery(query);
                    setSelectedUser(user);
                }}
                tasks={completedTasks}
                sections={sections}
                users={users} // Pass users to the search bar
                onTaskSelected={handleTaskSelect}
                onSectionSelected={handleSectionSelect}
            />
            <Accordion allowToggle>
                {filteredSections.length > 0 ? filteredSections.map(section => (
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
                                {selectedTask && selectedTask.sectionID === section.id ? (
                                    <CompletedTaskTable
                                        tasks={[selectedTask]}
                                        users={users}
                                        onStatusChange={handleStatusChange}
                                    />
                                ) : (
                                    <CompletedTaskTable
                                        tasks={getCompletedTasksForSection(section.id)}
                                        users={users}
                                        onStatusChange={handleStatusChange}
                                    />
                                )}
                            </AccordionPanel>
                        )}
                    </AccordionItem>
                )) : (
                    <Text>No sections found.</Text>
                )}
            </Accordion>
        </Box>
    );
};

export default CompletedTask;