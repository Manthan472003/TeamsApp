import React, { useEffect, useState, useCallback } from 'react';
import {
    Button, useDisclosure, Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast
} from '@chakra-ui/react';
import { getSections } from '../Services/SectionService';
import { saveTask, getTasksBySection, deleteTask, updateTask } from '../Services/TaskService';
import { getUsers } from '../Services/UserService'; // Assuming you have a UserService for fetching users
import AddSectionModal from './AddSectionModal';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import TaskTable from './TaskTable';

const TaskManager = () => {
    const { isOpen: isSectionOpen, onOpen: onSectionOpen, onClose: onSectionClose } = useDisclosure();
    const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure();
    const { isOpen: isEditTaskOpen, onOpen: onEditTaskOpen, onClose: onEditTaskClose } = useDisclosure();

    const [sections, setSections] = useState([]);
    const [tasksBySection, setTasksBySection] = useState({});
    const [users, setUsers] = useState([]); // State for users
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const toast = useToast();
    const userId = localStorage.getItem('userId'); // Get logged-in user ID

    // Fetch sections from API
    const fetchSections = useCallback(async () => {
        try {
            const response = await getSections();
            if (response && response.data) {
                setSections(response.data);
            } else {
                throw new Error('Unexpected response format');
            }
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

    // Fetch users from API
    const fetchUsers = useCallback(async () => {
        try {
            const response = await getUsers();
            if (response && response.data) {
                setUsers(response.data);
            } else {
                throw new Error('Unexpected response format');
            }
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

    // Fetch tasks for a specific section
    const fetchTasksBySection = useCallback(async (sectionId) => {
        try {
            const response = await getTasksBySection(sectionId);
            if (response && response.data) {
                setTasksBySection(prev => ({ ...prev, [sectionId]: response.data }));
            } else {
                throw new Error('Unexpected response format');
            }
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

    // Fetch initial data
    useEffect(() => {
        fetchSections();
        fetchUsers();
    }, [fetchSections, fetchUsers]);

    useEffect(() => {
        if (selectedSectionId) {
            fetchTasksBySection(selectedSectionId);
        }
    }, [selectedSectionId, fetchTasksBySection]);

    // Add a new section
    const addSection = async () => {
        try {
            await fetchSections(); // Refresh sections list
            toast({
                title: "Section added.",
                description: "The new section was successfully added.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error adding section.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Add a new task to the selected section
    const addTaskToSection = async (task) => {
        if (!task.sectionID) {
            toast({
                title: "Error adding task.",
                description: "Section ID is missing.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            await saveTask(task); // Call API to save task
            console.log(`Task added to section ${task.sectionID}:`, task);
            // Refresh tasks for the specific section only
            await fetchTasksBySection(task.sectionID);
            toast({
                title: "Task added.",
                description: "The new task was successfully added.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error adding task:', error.response || error);
            toast({
                title: "Error adding task.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Update an existing task
    const updateTask = async (taskId, updatedTask) => {
        try {
            await updateTask(updatedTask); // Call the correct updateTask function
            setTasksBySection(prev => {
                const updatedTasks = { ...prev };
                Object.keys(updatedTasks).forEach(sectionId => {
                    updatedTasks[sectionId] = updatedTasks[sectionId].map(task =>
                        task.id === taskId ? updatedTask : task
                    );
                });
                return updatedTasks;
            });
            toast({
                title: "Task updated.",
                description: "The task was successfully updated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error updating task:', error.response || error);
            toast({
                title: "Error updating task.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };


    // Handle task edit
    const handleEdit = (task) => {
        setTaskToEdit(task);
        onEditTaskOpen();
    };

    // Handle section selection and open task modal
    const handleSectionOpen = (sectionId) => {
        setSelectedSectionId(sectionId);
        fetchTasksBySection(sectionId); // Fetch tasks for the selected section
        onTaskOpen();
    };

    // Handle task deletion
    const handleDelete = async (task) => {
        try {
            await deleteTask(task.id); // Call API to delete task
            await fetchTasksBySection(selectedSectionId); // Refresh tasks list
            toast({
                title: "Task deleted.",
                description: "The task was successfully deleted.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting task:', error.response || error);
            toast({
                title: "Error deleting task.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box>
            <Button onClick={onSectionOpen} colorScheme='teal' variant='outline' mt={3} mb={4}>
                Add Section
            </Button>

            <AddSectionModal
                isOpen={isSectionOpen}
                onClose={onSectionClose}
                onSectionAdded={addSection}
            />

            <Accordion defaultIndex={sections.length > 0 ? [0] : []} allowMultiple>
                {sections.map(section => (
                    <AccordionItem key={section.id} borderWidth={1} borderRadius="md" mb={4}>
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
                                <Text fontSize='xl' fontWeight='bold' color='tomato'>{section.sectionName}</Text>
                                <Text fontSize='md' color='gray.500'>{section.description}</Text>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <Button onClick={() => handleSectionOpen(section.id)} colorScheme='teal' textColor='Orange.500' border={2} variant='outline'
                                sx={{ borderStyle: 'dotted', }} mb={3}>
                                Add Task to {section.sectionName || 'Unnamed Section'}
                            </Button>
                            <TaskTable
                                tasks={tasksBySection[section.id] || []}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onStatusChange={updateTask} // Pass the updateTask function
                                users={users} // Pass the list of users
                            />
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>

            <AddTaskModal
                isOpen={isTaskOpen}
                onClose={onTaskClose}
                onSubmit={(task) => addTaskToSection({ ...task, sectionID: selectedSectionId })}
                userId={userId}
                sectionID={selectedSectionId}
            />

            <EditTaskModal
                isOpen={isEditTaskOpen}
                onClose={onEditTaskClose}
                task={taskToEdit}
                onUpdate={updateTask}
            />
        </Box>
    );
}

export default TaskManager;
