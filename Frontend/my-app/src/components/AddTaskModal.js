import React, { useRef, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import {
    Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter,
    Button, FormControl, FormLabel, Input, Select, useToast, SimpleGrid
} from '@chakra-ui/react';
import UserDropdown from './UserDropdown';
import TagDropdown from './TagDropdown';
import { getSections } from '../Services/SectionService';
import { saveTask } from '../Services/TaskService'; // Adjust import path as necessary

const AddTaskModal = ({ isOpen, onClose, onSubmit, userId: propUserId, sectionID }) => {
    const initialRef = useRef(null);
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [status, setStatus] = useState('Not Started');
    const [selectedTags, setSelectedTags] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(sectionID || '');
    const [userId, setUserId] = useState(propUserId || '');
    const toast = useToast();

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await getSections();
                if (response && response.data) {
                    setSections(response.data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        };

        fetchSections();

        if (!propUserId) {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id);
            } else {
                console.error('No token found in local storage');
            }
        } else {
            setUserId(propUserId);
        }
    }, [propUserId]);

    useEffect(() => {
        setSelectedSection(sectionID || '');
    }, [sectionID]);

    const resetForm = () => {
        setTaskName('');
        setDueDate('');
        setAssignedTo('');
        setStatus('Not Started');
        setSelectedTags([]);
        setSelectedSection(sectionID || '');
    };

    const handleUserSelect = (userId) => {
        setAssignedTo(userId);
    };

    const handleTagSelect = (tags) => {
        setSelectedTags(tags);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validTagIDs = selectedTags.filter(id => id != null);

        const task = {
            taskName,
            dueDate,
            taskAssignedToID: assignedTo,
            taskCreatedByID: parseInt(userId, 10),
            status,
            sectionID: selectedSection,
            tagIDs: validTagIDs
        };

        try {
            await saveTask(task);
            toast({
                title: "Task added.",
                description: "The new task was successfully added.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error adding task:', error);
            toast({
                title: "Error adding task.",
                description: error.response?.data?.message || "An error occurred while adding the task.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const buttonStyles = {
        base: {
            fontSize: '23px',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundImage: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
            padding: '8px 6px',
            borderRadius: '0 0 0 0',
            transition: 'all 0.3s ease',
            marginBottom: '2px',
            width: '100%',
            textAlign: 'left',
            justifyContent: 'start',
            paddingLeft: '20px',
        },
    };

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            size="xl"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader sx={buttonStyles.base}>Add Task</DrawerHeader>
                <DrawerBody>
                    <form onSubmit={handleSubmit}>
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl mb={4}>
                                <FormLabel>Section</FormLabel>
                                <Select
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                >
                                    <option value="">Select Section</option>
                                    {sections.map(section => (
                                        <option key={section.id} value={section.id}>
                                            {section.sectionName}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Add Platform For Section</FormLabel>
                                <Select
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                >
                                    <option value="">Select Section</option>
                                    {sections.map(section => (
                                        <option key={section.id} value={section.id}>
                                            {section.sectionName}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </SimpleGrid>

                        <FormControl mb={4}>
                            <FormLabel>Task Name</FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder='Enter Task Name'
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                required
                            />
                        </FormControl>
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl mb={4}>
                                <FormLabel>Due Date</FormLabel>
                                <Input
                                    value={dueDate}
                                    type='date'
                                    onChange={(e) => setDueDate(e.target.value)}
                                    required
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Assigned To</FormLabel>
                                <UserDropdown
                                    selectedUser={assignedTo}
                                    onUserSelect={handleUserSelect}
                                />
                            </FormControl>
                        </SimpleGrid>

                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl mb={4}>
                                <FormLabel>Tags</FormLabel>
                                <TagDropdown
                                    selectedTags={selectedTags}
                                    onTagSelect={handleTagSelect}
                                    taskId={null} 
                                />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="On Hold">On Hold</option>
                                </Select>
                            </FormControl>
                        </SimpleGrid>

                        <Button type='submit' colorScheme='blue' mr={3}>Save</Button>
                        <Button onClick={() => {
                            resetForm();
                            onClose();
                        }}>Cancel</Button>
                    </form>
                </DrawerBody>

                <DrawerFooter>
                    {/* Any additional footer actions can go here */}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default AddTaskModal;