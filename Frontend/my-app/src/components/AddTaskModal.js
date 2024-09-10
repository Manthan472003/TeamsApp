import React, { useRef, useState } from 'react';
import {
    Select, Button, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl, FormLabel, Input,
    ModalCloseButton,
    useToast
} from '@chakra-ui/react';
import UserDropdown from './UserDropdown';

const AddTaskModal = ({ isOpen, onClose, onSubmit, userId, sectionID }) => {
    const initialRef = useRef(null);
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [status, setStatus] = useState('Not Started');
    const toast = useToast();

    const handleUserSelect = (userId) => {
        setAssignedTo(userId);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const task = {
            taskName,
            dueDate,
            taskAssignedToID: assignedTo,
            taskCreatedByID: parseInt(userId, 10),
            status,
            sectionID // Include sectionID here
        };
    
        try {
            await onSubmit(task);
            toast({
                title: "Task added.",
                description: "The new task was successfully added.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
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

        // Reset form fields
        setTaskName('');
        setDueDate('');
        setAssignedTo('');
        setStatus('Not Started');
        onClose();
    };

    return (
        <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent maxH="90vh">
                <ModalHeader
                    position="sticky"
                    top={0}
                    bg="white"
                    zIndex={1}
                >
                    Add Task
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    pb={0}
                    overflowY="auto"
                    maxH="calc(100vh - 150px)"
                >
                    <form onSubmit={handleSubmit}>
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
                        <ModalFooter
                            position="sticky"
                            bottom={0}
                            bg="white"
                            borderTopWidth="1px"
                        >
                            <Button type='submit' colorScheme='blue' mr={3}>Save</Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddTaskModal;
