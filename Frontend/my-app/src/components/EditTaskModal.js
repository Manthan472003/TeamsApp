import React, { useRef, useState } from 'react';
import {
    Select, Button, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl, FormLabel, Input,
    ModalCloseButton, Textarea,
} from '@chakra-ui/react';

//........................................................... Modal for editing a task
const EditTaskModal = ({ isOpen, onClose, task, onSubmit }) => {
    const initialRef = useRef(null);
    const [taskName, setTaskName] = useState(task.taskName || '');
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [tags, setTags] = useState(task.tags.join(', ') || '');
    const [assignedTo, setAssignedTo] = useState(task.taskAssignedTo || '');
    const [status, setStatus] = useState(task.status || 'A');
    const [subTask, setSubTask] = useState(task.subTask || '');
    const [description, setDescription] = useState(task.description || '');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!taskName.trim()) {
            alert('Task name cannot be empty.');
            return;
        }
        onSubmit(task.id, {
            ...task,
            taskName,
            tags: tags.split(',').map(tag => tag.trim()),
            taskAssignedTo: assignedTo,
            status
        });
        onClose();
    };

    return (
        <Modal
            initialFocusRef={initialRef}
            isOpen={isOpen}
            onClose={onClose}
            size="xl" // You can adjust the size as needed
        >
            <ModalOverlay />
            <ModalContent
                maxH="90vh" // Set maximum height for the modal content
                overflow="hidden" // Hide overflow to avoid issues
            >
                <ModalHeader
                    position="sticky" // Make header sticky
                    top={0} // Stick to the top
                    bg="white" // Ensure background is set to avoid transparency issues
                    zIndex={1} // Ensure it stays above other content
                >
                    Edit Task
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    pb={6}
                    overflowY="auto" // Allow vertical scrolling
                    maxH="calc(90vh - 100px)" // Adjust max height based on header and footer height
                >
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
                        <FormControl mt={4}>
                            <FormLabel>SubTask</FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder='Enter Subtask'
                                value={subTask}
                                onChange={(e) => setSubTask(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Add Description</FormLabel>
                            <Textarea
                                ref={initialRef}
                                placeholder='Here is a sample placeholder'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>

                        <ModalFooter position="sticky"
                            bottom={0}
                            bg="white"
                            zIndex={1}
                            borderTopWidth={1}
                        >
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

export default EditTaskModal
