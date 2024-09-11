import React, { useRef, useState, useEffect } from 'react';
import {
    Select, Button, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl, FormLabel, Input,
    ModalCloseButton, useToast
} from '@chakra-ui/react';
import { updateTask } from '../Services/TaskService';
import UserDropdown from './UserDropdown';
import TagDropdown from './TagDropdown';  // Import TagDropdown

const EditTaskModal = ({ isOpen, onClose, task, onUpdate = () => {} }) => {
    const initialRef = useRef(null);

    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [status, setStatus] = useState('Not Started');
    const [subTask, setSubTask] = useState('');
    const [description, setDescription] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [selectedTags, setSelectedTags] = useState([]); // State for selected tags
    const [showMore, setShowMore] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (task) {
            setTaskName(task.taskName || '');
            setDueDate(task.dueDate || '');
            setAssignedTo(task.taskAssignedToID || '');
            setStatus(task.status || 'Not Started');
            setSubTask(task.subTask || '');
            setDescription(task.description || '');
            setSectionId(task.sectionID || '');
            setSelectedTags(task.tagIDs || []); // Initialize selected tags
        }
    }, [task]);

    const handleUserSelect = (userId) => {
        setAssignedTo(userId);
    };

    const handleTagSelect = (tags) => {
        setSelectedTags(tags);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!task) return;

        const payload = {
            id: task.id,
            taskName,
            dueDate,
            taskAssignedToID: assignedTo,
            taskCreatedByID: task.taskCreatedByID, // Preserving original creator ID
            status,
            subTask,
            description,
            sectionID: sectionId,
            tagIDs: selectedTags // Include selected tags
        };

        try {
            await updateTask(payload);
            onUpdate(payload);
            onClose();

            toast({
                title: "Task Updated",
                description: "The task has been successfully updated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Failed to update task:', error.response ? error.response.data : error.message);

            toast({
                title: "Update Failed",
                description: "There was an error updating the task.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent maxH="90vh" overflow="hidden">
                <ModalHeader position="sticky" top={0} bg="white" zIndex={1}>Edit Task</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={0} overflowY="auto" maxH="calc(100vh - 150px)">
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
                        {showMore && (
                            <>
                                <FormControl mb={4}>
                                    <FormLabel>Sub-Task</FormLabel>
                                    <Input
                                        placeholder='Enter Sub-Task'
                                        value={subTask}
                                        onChange={(e) => setSubTask(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>Description</FormLabel>
                                    <Input
                                        placeholder='Enter Description'
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </FormControl>
                            </>
                        )}
                        <Button mt={4} onClick={() => setShowMore(!showMore)}>
                            {showMore ? 'Show Less' : 'Show More'}
                        </Button>
                        <ModalFooter position="sticky" bottom={0} bg="white" borderTopWidth="1px">
                            <Button type='submit' colorScheme='blue' mr={3}>Save</Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditTaskModal;