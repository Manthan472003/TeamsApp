import React, { useEffect, useState, useCallback } from 'react';
import {
    Button, useDisclosure, Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast
} from '@chakra-ui/react';
import { getSections, saveSection } from '../Services/SectionService';
import AddSectionModal from './AddSectionModal';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import TaskTable from './TaskTable';

// ............................................................Main component to manage sections and tasks
const TaskManager = () => {
    const { isOpen: isSectionOpen, onOpen: onSectionOpen, onClose: onSectionClose } = useDisclosure();
    const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure();
    const { isOpen: isEditTaskOpen, onOpen: onEditTaskOpen, onClose: onEditTaskClose } = useDisclosure();

    const [sections, setSections] = useState([]);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const toast = useToast();

    // Fetch sections with error handling
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

    // Handle section addition
    const addSection = async (sectionData) => {
        try {
            await saveSection(sectionData); 
            await fetchSections();
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

    // Add a task to a section
    const addTaskToSection = (task) => {
        if (selectedSectionIndex === null) return; // No section selected

        const updatedSections = [...sections];
        updatedSections[selectedSectionIndex].tasks = [
            ...(updatedSections[selectedSectionIndex].tasks || []),
            task
        ]; 
        // Ensure tasks array exists
        setSections(updatedSections);
    };

    // Update a task in a section
    const updateTask = (taskId, updatedTask) => {
        const updatedSections = sections.map(section => ({
            ...section,
            tasks: section.tasks.map(task => (task.id === taskId ? updatedTask : task))
        }));
        setSections(updatedSections);
    };

    // Handle task editing
    const handleEdit = (task) => {
        setTaskToEdit(task);
        onEditTaskOpen();
    };

    // Handle opening the task modal
    const handleSectionOpen = (index) => {
        setSelectedSectionIndex(index);
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

            <Accordion defaultIndex={[0]} allowMultiple>
                {sections.map((section, index) => (
                    <AccordionItem key={section.id} borderWidth={1} borderRadius="md" mb={4}>
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
                                <Text fontSize='xl' fontWeight='bold' color='tomato'>
                                    {section.SectionName}
                                </Text>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                            <Button onClick={() => handleSectionOpen(index)}>
                                Add Task to {section.SectionName}
                            </Button>
                            <TaskTable
                                tasks={section.tasks || []} // Ensure tasks array exists
                                onEdit={handleEdit}
                                onDelete={(task) => console.log('Delete', task)}
                            />
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>

            <AddTaskModal
                isOpen={isTaskOpen}
                onClose={onTaskClose}
                sectionIndex={selectedSectionIndex}
                onSubmit={addTaskToSection}
            />

            {taskToEdit && (
                <EditTaskModal
                    isOpen={isEditTaskOpen}
                    onClose={onEditTaskClose}
                    task={taskToEdit}
                    onSubmit={(updatedTask) => {
                        updateTask(taskToEdit.id, updatedTask);
                        onEditTaskClose();
                    }}
                />
            )}
        </Box>
    );
};

export default TaskManager;
