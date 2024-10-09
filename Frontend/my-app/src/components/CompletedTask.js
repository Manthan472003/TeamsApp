import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useToast,
    Spacer,
    Heading,
    useDisclosure,
} from '@chakra-ui/react';

import { getSections } from '../Services/SectionService';
import { getCompletedTasks, getTasksBySection, updateTask } from '../Services/TaskService';
import { getUsers } from '../Services/UserService';
import CompletedTaskTable from './CompletedTaskTable';
import SearchBar from './SearchBar';
import CompletedTaskDrawer from './CompletedTaskDrawer';

const CompletedTask = () => {
    const [sections, setSections] = useState([]);
    const [tasksBySection, setTasksBySection] = useState({});
    const [completedTasks, setCompletedTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [openSections, setOpenSections] = useState([]);
    const { isOpen: isViewTaskOpen, onOpen: onViewTaskOpen, onClose: onViewTaskClose } = useDisclosure();

    const toast = useToast();

    const fetchSections = useCallback(async () => {
        try {
            const response = await getSections();
            setSections(response.data);
            setOpenSections(response.data.map(section => section.id));
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
        setOpenSections(prev => {
            if (!prev.includes(section.id)) {
                return [...prev, section.id];
            }
            return prev;
        });
    };

    const handleTaskSelected = (task) => {
        setSelectedTask(task);
        onViewTaskOpen(); // Open the ViewTaskDrawer
    };

    const getCompletedTasksForSection = (sectionId) => {
        return (tasksBySection[sectionId] || []).filter(task => {
            const matchesSearch = task.taskName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesUser = selectedUser ? task.userId === selectedUser : true;
            return task.status === 'Completed' && !task.isDelete && matchesSearch && matchesUser;
        });
    };

    const handleSearchQueryChange = (query, user) => {
        setSearchQuery(query);
        setSelectedUser(user);

        // Open the drawer if a task matches the search
        const matchingTask = completedTasks.find(task => task.taskName.toLowerCase().includes(query.toLowerCase()));
        if (matchingTask) {
            setSelectedTask(matchingTask);
            onViewTaskOpen();
        } else {
            setSelectedTask(null); // Clear selected task if no match found
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const taskToUpdate = Object.values(tasksBySection).flat().find(task => task.id === taskId);
            if (taskToUpdate) {
                taskToUpdate.status = newStatus;
                await updateTask(taskToUpdate);
                taskToUpdate.sectionID ? await fetchTasksBySection(taskToUpdate.sectionID) : await fetchCompletedTasks();
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

    const filteredSections = useMemo(() => {
        if (searchQuery) {
            return sections.filter(section =>
                section.sectionName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return sections;
    }, [sections, searchQuery]);

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
                onApplyFilter={handleSearchQueryChange} // Updated to handle search change
                tasks={completedTasks}
                sections={sections}
                users={users}
                onTaskSelected={handleTaskSelected}
                onSectionSelected={handleSectionSelect}
                placeholder="Search Completed Tasks... "

            />
            <Accordion allowToggle>
                {filteredSections.length > 0 ? filteredSections.map(section => (
                    <AccordionItem key={section.id} borderWidth={1} borderRadius="md" mb={4}>
                        <AccordionButton onClick={() => handleSectionSelect(section)}>
                            <Box flex='1' textAlign='left'>
                                <Text fontSize='xl' fontWeight='bold' color='#149edf'>{section.sectionName}</Text>
                                <Text fontSize='md' color='gray.500'>{section.description}</Text>
                            </Box>
                            <Spacer />
                            <AccordionIcon />
                        </AccordionButton>
                        {openSections.includes(section.id) && (
                            <AccordionPanel pb={4}>
                                <CompletedTaskTable
                                    tasks={getCompletedTasksForSection(section.id)}
                                    users={users}
                                    onStatusChange={handleStatusChange}
                                />
                            </AccordionPanel>
                        )}
                    </AccordionItem>
                )) : (
                    <Text>No sections found.</Text>
                )}
            </Accordion>

            <CompletedTaskDrawer
                isOpen={isViewTaskOpen}
                onClose={onViewTaskClose}
                task={selectedTask} // Pass the selected task to the drawer
                onUpdateTask={handleStatusChange} // Pass the function to update task directly
                users={users}
            />
        </Box>
    );
};

export default CompletedTask;