import React, { useEffect, useState, useCallback } from 'react';
import {
    Button, useDisclosure, Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast
} from '@chakra-ui/react';
import { getSections } from '../Services/SectionService';
import { saveTask } from '../Services/TaskService';
import AddSectionModal from './AddSectionModal';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import TaskTable from './TaskTable';

const TaskManager = () => {
    const { isOpen: isSectionOpen, onOpen: onSectionOpen, onClose: onSectionClose } = useDisclosure();
    const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure();
    const { isOpen: isEditTaskOpen, onOpen: onEditTaskOpen, onClose: onEditTaskClose } = useDisclosure();

    const [sections, setSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const toast = useToast();
    const userId = localStorage.getItem('userId'); // Get logged-in user ID

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

    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

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
            await saveTask(task); // Call API to create task
            await fetchSections(); // Refresh sections list after task creation
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

    const updateTask = (taskId, updatedTask) => {
        const updatedSections = sections.map(section => ({
            ...section,
            tasks: section.tasks.map(task => (task.id === taskId ? updatedTask : task))
        }));
        setSections(updatedSections);
    };

    const handleEdit = (task) => {
        setTaskToEdit(task);
        onEditTaskOpen();
    };

    const handleSectionOpen = (sectionId) => {
        setSelectedSectionId(sectionId);
        onTaskOpen();
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
                            <Button onClick={() => handleSectionOpen(section.id)} colorScheme='blue' mb={3}>
                                Add Task to {section.sectionName || 'Unnamed Section'}
                            </Button>
                            <TaskTable
                                tasks={section.tasks}
                                onEdit={handleEdit}
                            />
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>

            <AddTaskModal
                isOpen={isTaskOpen}
                onClose={onTaskClose}
                onSubmit={(task) => addTaskToSection({ ...task, sectionID: selectedSectionId })}
                userId={userId} // Pass the user ID
                sectionID={selectedSectionId} // Pass the section ID to the modal
            />

            <EditTaskModal
                isOpen={isEditTaskOpen}
                onClose={onEditTaskClose}
                task={taskToEdit}
                onUpdate={updateTask}
            />
        </Box>
    );
};

export default TaskManager;
