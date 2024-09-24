import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Button, useDisclosure, Spacer, Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast, Heading,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

import { getSections, deleteSection, updateSection } from '../Services/SectionService';
import { saveTask, getTasksBySection, deleteTask, updateTask, getTasksWithoutSection } from '../Services/TaskService';
import { getUsers } from '../Services/UserService';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import TaskTable from './TaskTable';
import EditSectionModal from './EditSectionModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';


const TaskManager = () => {
    const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure();
    const { isOpen: isEditTaskOpen, onOpen: onEditTaskOpen, onClose: onEditTaskClose } = useDisclosure();
    const { isOpen: isEditSectionOpen, onOpen: onEditSectionOpen, onClose: onEditSectionClose } = useDisclosure();
    const { isOpen: isConfirmDeleteOpen, onOpen: onConfirmDeleteOpen, onClose: onConfirmDeleteClose } = useDisclosure();

    const [sections, setSections] = useState([]);
    const [tasksBySection, setTasksBySection] = useState({});
    const [tasksWithoutSection, setTasksWithoutSection] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [sectionToEdit, setSectionToEdit] = useState(null);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [openSections, setOpenSections] = useState([]); // State to manage open sections
    const [selectedSection, setSelectedSection] = useState(null); // New state for selected section



    const toast = useToast();

    const applyFilter = (filterItems) => {
        setFilteredItems(filterItems);

        // Get section IDs from filtered tasks and open them
        const newOpenSections = sections.filter(section =>
            filterItems.some(item =>
                item.type === 'task' && tasksBySection[section.id]?.some(task => task.id === item.id)
            )
        ).map(section => section.id);

        setOpenSections(newOpenSections);
    };

    const doesTaskMatchFilter = (task) => {
        if (!filteredItems.length) return true;
        return filteredItems.some(item =>
            (item.type === 'task' && item.id === task.id) ||
            (item.type === 'section' && task.sectionID === item.id)
        );
    };

    // Callback to be passed to SearchBar to handle section selection
    const handleSectionSelected = (section) => {
        setSelectedSection(section);  // Set the selected section
        setOpenSections(prevOpenSections => {
            if (!prevOpenSections.includes(section.id)) {
                return [...prevOpenSections, section.id];
            } else {
                return prevOpenSections;
            }
        }); // Expand the section accordion
    };

    const filteredSections = useMemo(() => {
        if (selectedSection) {
            return sections.filter(section => section.id === selectedSection.id);
        }
        return sections; // If no section is selected, show all sections
    }, [sections, selectedSection]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch sections, users, and tasks here
        };
        fetchData();
    }, []);

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

    const fetchTasksWithoutSection = useCallback(async () => {
        try {
            const response = await getTasksWithoutSection();
            if (response && response.data) {
                setTasksWithoutSection(response.data);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Fetch Tasks Without Section Error:', error);
            toast({
                title: "Error fetching tasks without section.",
                description: "Unable to fetch tasks without section. Please try again.",
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

    useEffect(() => {
        fetchTasksWithoutSection(); // Fetch tasks without a section initially
    }, [fetchTasksWithoutSection]);



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
            if (task.sectionID !== null) {
                await fetchTasksBySection(task.sectionID); // Refresh tasks for the specific section
            } else {
                await fetchTasksWithoutSection(); // Refresh tasks without section
            }
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
            const taskToUpdate = Object.values(tasksBySection).flat().find(task => task.id === taskId);
            if (taskToUpdate) {
                taskToUpdate.status = newStatus;
                await updateTask(taskToUpdate); // Update task status in the backend
                if (taskToUpdate.sectionID !== null) {
                    await fetchTasksBySection(taskToUpdate.sectionID); // Refresh tasks for the specific section
                } else {
                    await fetchTasksWithoutSection(); // Refresh tasks without section
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

    const handleEdit = (task) => {
        setTaskToEdit(task);
        onEditTaskOpen();
    };

    const handleSectionClick = (sectionId) => {
        setSelectedSectionId(sectionId);
    };

    const handleEditSection = (section) => {
        setSectionToEdit(section);
        onEditSectionOpen();
    };

    const handleDelete = async (task) => {
        try {
            await deleteTask(task.id); // Delete task
            if (task.sectionID !== null) {
                await fetchTasksBySection(task.sectionID); // Refresh tasks for the specific section
            } else {
                await fetchTasksWithoutSection(); // Refresh tasks without section
            }
            toast({
                title: "Task deleted.",
                description: "The task was successfully deleted.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting task:', error);
            toast({
                title: "Error deleting task.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDeleteSection = (section) => {
        setSectionToDelete(section);
        onConfirmDeleteOpen();
    };

    const handleConfirmDelete = async () => {
        if (!sectionToDelete) return;
        try {
            const response = await deleteSection(sectionToDelete.id); // Delete section
            if (response.status === 200) {
                setSections(prevSections =>
                    prevSections.filter(sec => sec.id !== sectionToDelete.id)
                );
                setTasksBySection(prevTasks => {
                    const newTasks = { ...prevTasks };
                    delete newTasks[sectionToDelete.id];
                    return newTasks;
                });
                await fetchTasksWithoutSection(); // Refresh tasks without section
                toast({
                    title: "Section deleted.",
                    description: "The section was successfully deleted.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting section:', error.response || error);
            toast({
                title: "Error deleting section.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            onConfirmDeleteClose();
        }
    };

    const handleUpdateSection = async (section) => {
        try {
            const response = await updateSection(section); // Update section via API
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

    // Helper function to filter out completed tasks
    const filterTasks = (tasks) => {
        return tasks.filter(task => task.status !== 'Completed');
    };

    return (
        <Box mt={5}>
            <Sidebar onSectionAdded={fetchSections} />
            <Heading as='h2' size='xl' paddingLeft={3}
                sx={{
                    background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                }}>
                Dashboard
            </Heading>
            <br />
            <br />

            <SearchBar 
            onSectionSelected={handleSectionSelected} 
            onApplyFilter={applyFilter} />


            <Accordion allowToggle>
                {filteredSections.map(section => {
                    const tasksToShow = tasksBySection[section.id]?.filter(doesTaskMatchFilter) || [];

                    return (
                        <AccordionItem key={section.id} borderWidth={1} borderRadius="md" mb={4} isOpen={openSections.includes(section.id)}>
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
                                    onClick={onTaskOpen}
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
                                    tasks={filterTasks(tasksToShow)} // Use filtered tasks
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onStatusChange={handleStatusChange}
                                    users={users}
                                />
                            </AccordionPanel>
                        </AccordionItem>
                    );
                })}

                {/* "Others" Section */}
                {/* <AccordionItem borderWidth={1} borderRadius="md" mb={4}>
                    <AccordionButton>
                        <Box flex='1' textAlign='left'>
                            <Text fontSize='xl' fontWeight='bold' color='#149edf'>Others</Text>
                            <Text fontSize='md' color='gray.500'>Tasks without a specific section</Text>
                        </Box>
                        <Spacer />
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <TaskTable
                            tasks={filterTasks(tasksWithoutSection)}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                            users={users}
                        />
                    </AccordionPanel>
                </AccordionItem> */}
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

            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={onConfirmDeleteClose}
                onConfirm={handleConfirmDelete}
                itemName={sectionToDelete ? sectionToDelete.sectionName : ''}
            />
        </Box>
    );
};

export default TaskManager;
