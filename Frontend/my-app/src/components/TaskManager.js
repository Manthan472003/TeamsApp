import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Button, useDisclosure, Spacer, IconButton, Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast, Heading,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

import ViewTaskDrawer from './ViewTaskDrawer';

import { getSections, updateSection } from '../Services/SectionService';
import { saveTask, getTasksBySection, deleteTask, updateTask, getTasksWithoutSection, getNonDeletedNonCompletedTasks } from '../Services/TaskService';
import { getUsers } from '../Services/UserService';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import TaskTable from './TaskTable';
import EditSectionModal from './EditSectionModal';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';


const TaskManager = () => {
    const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure();
    const { isOpen: isEditTaskOpen, onOpen: onEditTaskOpen, onClose: onEditTaskClose } = useDisclosure();
    const { isOpen: isEditSectionOpen, onOpen: onEditSectionOpen, onClose: onEditSectionClose } = useDisclosure();
    const { isOpen: isViewTaskOpen, onOpen: onViewTaskOpen, onClose: onViewTaskClose } = useDisclosure();


    const [sections, setSections] = useState([]);
    const [tasksBySection, setTasksBySection] = useState({});
    const [, setTasksWithoutSection] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [sectionToEdit, setSectionToEdit] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [openSections, setOpenSections] = useState([]); // State to manage open sections
    const [selectedSection, setSelectedSection] = useState(null); // New state for selected section
    const [selectedTask, setSelectedTask] = useState(null); // State to store selected task for the drawer
    const [tasks, setTasks] = useState([]); // assuming tasksBySection is an object with section IDs as keys and taskToEdit arrays as values
    const [filteredTasks, setFilteredTasks] = useState([]);





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

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasksRes = await getNonDeletedNonCompletedTasks(); // Replace with your actual API call
                setTasks(tasksRes.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);
    useEffect(() => {
        const filteredTasks = tasks.filter(task => task.status !== 'Completed' && !task.isDelete);
        setFilteredTasks(filteredTasks);
    }, [tasks]);


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
    const handleTaskSelected = (task) => {
        setSelectedTask(task);
        onViewTaskOpen(); // Open the ViewTaskDrawer
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

    // Function to refresh tasks
    const refreshTasks = async () => {
        await fetchSections();
        if (selectedSectionId) {
            await fetchTasksBySection(selectedSectionId);
        }
        await fetchTasksWithoutSection();
    };

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
            // Call API to save the task
            await saveTask(task);

            // Refresh tasks based on section ID
            if (task.sectionID) {
                await fetchTasksBySection(task.sectionID);
            } else {
                await fetchTasksWithoutSection();
            }

            // Show success message
            toast({
                title: "Task added.",
                description: "The new task was successfully added.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error adding task:', error.response ? error.response.data : error);
            toast({
                title: "Error adding task.",
                description: error.response ? error.response.data.message : "An unexpected error occurred.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            // Refresh tasks regardless of success or failure
            refreshTasks();
        }
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
                    await fetchTasksWithoutSection();
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
            await deleteTask(task.id);
            if (task.sectionID !== null) {
                await fetchTasksBySection(task.sectionID);
            } else {
                await fetchTasksWithoutSection();
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

    const handleUpdateSection = async (section) => {
        try {
            const response = await updateSection(section);
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
            <Sidebar
                onSectionAdded={fetchSections}
                onTaskAdded={refreshTasks} // Pass refreshTasks function here
            />
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

            <SearchBar
                onSectionSelected={handleSectionSelected}
                onTaskSelected={handleTaskSelected}
                onApplyFilter={applyFilter}
                tasks={filteredTasks}
            />

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
                                <IconButton
                                    icon={<EditIcon />}
                                    onClick={() => handleEditSection(section)}
                                    colorScheme='green'
                                    size='lg'
                                    ml={2}
                                    border={0}
                                    variant="outline"
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
            </Accordion>

            <AddTaskModal
                isOpen={isTaskOpen}
                onClose={onTaskClose}
                onSubmit={(task) => addTaskToSection({ ...task, sectionID: selectedSectionId, createdBy: currentUserId })}
            />


            {taskToEdit && (
                <EditTaskModal
                    isOpen={isEditTaskOpen}
                    onClose={onEditTaskClose}
                    task={taskToEdit}
                    onUpdate={() => fetchTasksBySection(selectedSectionId)}
                />
            )}

            <ViewTaskDrawer
                isOpen={isViewTaskOpen}
                onClose={onViewTaskClose}
                task={selectedTask} // Pass the selected task to the drawer
            />

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