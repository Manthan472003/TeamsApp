import React, { useRef, useState } from 'react';
import {
    Select, Button, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl, FormLabel, Input,
    ModalCloseButton,
} from '@chakra-ui/react';
import TagDropdown from './TagDropdown';
import UserDropdown from './UserDropdown';  // Import UserDropdown

const AddTaskModal = ({ isOpen, onClose, sectionIndex, onSubmit }) => {
    const initialRef = useRef(null);
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [assignedTo, setAssignedTo] = useState('');
    const [status, setStatus] = useState('A');

    const handleTagSelect = (tags) => {
        setSelectedTags(tags);
    };

    const handleUserSelect = (userId) => {
        setAssignedTo(userId);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const task = {
            id: Date.now(), // Unique ID for each task
            taskName,
            dueDate,
            tags: selectedTags,
            taskAssignedTo: assignedTo,
            status
        };
        console.log('Submitting task:', { sectionIndex, task });

        onSubmit(sectionIndex, task);

        setTaskName('');
        setDueDate('');
        setSelectedTags([]);
        setAssignedTo('');
        setStatus('A');
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
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Due Date</FormLabel>
                            <Input
                                value={dueDate}
                                type='date'
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Tags</FormLabel>
                            <TagDropdown
                                selectedTags={selectedTags}
                                onTagSelect={handleTagSelect}
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
                                <option value="A">Not Started</option>
                                <option value="B">In Progress</option>
                                <option value="D">On Hold</option>
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
