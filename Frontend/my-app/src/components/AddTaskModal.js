import React, { useRef, useState } from 'react';

import {
    Select, Button,  Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl, FormLabel, Input,
     ModalCloseButton,
} from '@chakra-ui/react';

// ..........................................................Modal for adding a new task
const AddTaskModal = ({ isOpen, onClose, sectionIndex, onSubmit }) => {
    const initialRef = useRef(null);
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [tags, setTags] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [status, setStatus] = useState('A');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!taskName.trim()) {
            alert('Task name cannot be empty.');
            return;
        }
        onSubmit(sectionIndex, {
            id: Date.now(), // Unique ID for each task
            taskName,
            tags: tags.split(',').map(tag => tag.trim()),
            taskAssignedTo: assignedTo,
            status
        });
        setTaskName('');
        setDueDate('');
        setTags('');
        setAssignedTo('');
        setStatus('A');
        onClose();
    };

    return (
        <Modal
            initialFocusRef={initialRef}
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Task</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <form onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel>Task Name</FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder='Enter Task Name'
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Due Date</FormLabel>
                            <Input
                                ref={initialRef}
                                value={dueDate}
                                type='date'
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Tags (comma separated)</FormLabel>
                            <Input
                                placeholder='Enter Tags'
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Assigned To</FormLabel>
                            <Input
                                placeholder='Enter Assigned Person'
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mt={4}>
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
                        <ModalFooter>
                            <Button type='submit' colorScheme='blue' mr={3}>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};


export default AddTaskModal
