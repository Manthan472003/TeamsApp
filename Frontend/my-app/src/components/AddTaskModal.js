import React, { useRef, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import {
    Select, Button, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl, FormLabel, Input,
    ModalCloseButton,
    useToast
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
    const [selectedSection, setSelectedSection] = useState(sectionID || ''); // Initialize with sectionID prop
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
            const token = localStorage.getItem('token'); // Adjust the key based on how you store your token
            if (token) {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id); // Use 'id' based on your token structure
            } else {
                console.error('No token found in local storage');
            }
        } else {
            setUserId(propUserId);
        }
    }, [propUserId]);

    useEffect(() => {
        setSelectedSection(sectionID || ''); // Update selectedSection when sectionID changes
    }, [sectionID]);

    const resetForm = () => {
        setTaskName('');
        setDueDate('');
        setAssignedTo('');
        setStatus('Not Started');
        setSelectedTags([]);
        setSelectedSection(sectionID || ''); // Reset section
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
            taskCreatedByID: parseInt(userId, 10), // Ensure userId is sent as a number
            status,
            sectionID: selectedSection, // Ensure this is included
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

    return (
        <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent maxH="90vh">
                <ModalHeader position="sticky" top={0} bg="white" zIndex={1}>
                    Add Task
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={0} overflowY="auto" maxH="calc(100vh - 150px)">
                    <form onSubmit={handleSubmit}>
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
                            <FormLabel>Task Name</FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder='Enter Task Name'
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                required
                            />
                        </FormControl>
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
                        <FormControl mb={4}>
                            <FormLabel>Tags</FormLabel>
                            <TagDropdown
                                selectedTags={selectedTags}
                                onTagSelect={handleTagSelect}
                                taskId={null} // Pass null since we are adding a task
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
                        <ModalFooter position="sticky" bottom={0} bg="white" borderTopWidth="1px">
                            <Button type='submit' colorScheme='blue' mr={3}>Save</Button>
                            <Button onClick={() => {
                                resetForm();
                                onClose();
                            }}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddTaskModal;
