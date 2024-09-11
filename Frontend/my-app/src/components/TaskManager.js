import React, { useEffect, useState, useCallback } from 'react';
import {
    Button, useDisclosure, Spacer, Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

import { getSections, deleteSection, updateSection } from '../Services/SectionService';
import { saveTask, getTasksBySection, deleteTask, updateTask } from '../Services/TaskService';
import { getUsers } from '../Services/UserService';
import AddSectionModal from './AddSectionModal';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import TaskTable from './TaskTable';
import EditSectionModal from './EditSectionModal';

const TaskManager = () => {
    const { isOpen: isSectionOpen, onOpen: onSectionOpen, onClose: onSectionClose } = useDisclosure();
    const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure();
    const { isOpen: isEditTaskOpen, onOpen: onEditTaskOpen, onClose: onEditTaskClose } = useDisclosure();
    const { isOpen: isEditSectionOpen, onOpen: onEditSectionOpen, onClose: onEditSectionClose } = useDisclosure();

    const [sections, setSections] = useState([]);
    const [tasksBySection, setTasksBySection] = useState({});
    const [users, setUsers] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [sectionToEdit, setSectionToEdit] = useState(null);
    const toast = useToast();

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

    const fetchUsers = useCallback(async () => {
        try {
            const response = await getUsers();
            if (response && response.data) {
                setUsers(response.data);
                setCurrentUserId(response.data[0]?.id); // Adjust based on your application logic
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

    useEffect(() => {
        fetchSections();
        fetchUsers();
    }, [fetchSections, fetchUsers]);

    useEffect(() => {
        if (selectedSectionId) {
            fetchTasksBySection(selectedSectionId);
        }
    }, [selectedSectionId, fetchTasksBySection]);

    const addSection = async (newSection) => {
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

    const addTaskToSection = async (task) => {
        if (!task.sectionID || !currentUserId) {
            toast({
                title: "Error adding task.",
                description: "Section ID or User ID is missing.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            await saveTask(task); // Call API to save task
            await fetchTasksBySection(task.sectionID); // Refresh tasks for the specific section
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

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const taskToUpdate = tasksBySection[selectedSectionId]?.find(task => task.id === taskId);
            if (taskToUpdate) {
                taskToUpdate.status = newStatus;
                await updateTask(taskToUpdate); // Call API to update the task status in the backend
                await fetchTasksBySection(selectedSectionId); // Refresh tasks for the specific section
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

    const handleEdit = (task) => {
        setTaskToEdit(task);
        onEditTaskOpen();

        toast({
            title: "Editing Task",
            description: `You are now editing the task: ${task.taskName}`, // Assumes the task has a title property
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleSectionClick = (sectionId) => {
        setSelectedSectionId(sectionId);
    };

    const handleDelete = async (task) => {
        try {
            await deleteTask(task.id); // Call API to delete task
            setTasksBySection(prev => {
                const updatedTasks = { ...prev };
                if (updatedTasks[selectedSectionId]) {
                    updatedTasks[selectedSectionId] = updatedTasks[selectedSectionId].filter(t => t.id !== task.id);
                }
                return updatedTasks;
            });

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

    const handleEditSection = (section) => {
        setSectionToEdit(section);
        onEditSectionOpen(); // Open the edit section modal
    };

    const handleDeleteSection = async (section) => {
        try {
            await deleteSection(section.id);
            await fetchSections(); // Refresh sections list
            toast({
                title: "Section deleted.",
                description: "The section was successfully deleted.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting section:', error.response || error);
            toast({
                title: "Error deleting section.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleUpdateSection = async (section) => {
        try {
            const response = await updateSection(section); // Call to API service
            if (response.status === 200) {
                setSections(prevSections => 
                    prevSections.map(sec => 
                        sec.id === section.id ? response.data.section : sec
                    )
                );

                toast({
                    title: "Section updated.",
                    description: "The section was successfully updated.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error updating section:', error);
            toast({
                title: "Error updating section.",
                description: error.message || "Unable to update section.",
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

            <Accordion >
                {sections.map(section => (
                    <AccordionItem key={section.id} borderWidth={1} borderRadius="md" mb={4}>
                        <AccordionButton onClick={() => handleSectionClick(section.id)}>
                            <Box flex='1' textAlign='left'>
                                <Text fontSize='xl' fontWeight='bold' color='#149edf'>{section.sectionName}</Text>
                                <Text fontSize='md' color='gray.500'>{section.description}</Text>
                            </Box>
                            <Spacer />
                            <Button
                                variant='solid'
                                colorScheme='green'
                                size='sm'
                                ml={2}
                                leftIcon={<EditIcon />}
                                onClick={() => handleEditSection(section)}
                            />
                            <Button
                                variant='solid'
                                colorScheme='red'
                                size='sm'
                                ml={2}
                                leftIcon={<DeleteIcon />}
                                onClick={(e) => { e.stopPropagation(); handleDeleteSection(section); }}
                            />
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <Button
                                onClick={() => onTaskOpen()}
                                colorScheme='teal'
                                textColor='Orange.500'
                                border={2}
                                variant='outline'
                                sx={{ borderStyle: 'dotted' }}
                                mb={3}
                            >
                                Add Task to {section.sectionName || 'Unnamed Section'}
                            </Button>
                            <TaskTable
                                tasks={tasksBySection[section.id] || []}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                                users={users}
                            />
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>

            <AddTaskModal
                isOpen={isTaskOpen}
                onClose={onTaskClose}
                onSubmit={(task) => addTaskToSection({ ...task, sectionID: selectedSectionId, createdBy: currentUserId })}
                sectionID={selectedSectionId}
            />

            {taskToEdit && (
                <EditTaskModal
                    isOpen={isEditTaskOpen}
                    onClose={onEditTaskClose}
                    task={taskToEdit}
                    onUpdate={() => fetchTasksBySection(selectedSectionId)}
                />
            )}

            {sectionToEdit && (
                <EditSectionModal
                    isOpen={isEditSectionOpen}
                    onClose={onEditSectionClose}
                    section={sectionToEdit}
                    onSectionUpdated={handleUpdateSection}
                />
            )}
        </Box>
    );
};

export default TaskManager;
