import React, { useRef, useState, useEffect } from 'react';
import {
    Select, Button, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl, FormLabel, Input,
    ModalCloseButton, 
} from '@chakra-ui/react';
// import TagDropdown from './TagDropdown';

const EditTaskModal = ({ isOpen, onClose, task, onUpdate = () => {} }) => {
    const initialRef = useRef(null);

    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [assignedTo, setAssignedTo] = useState('');
    const [status, setStatus] = useState('A');
    const [subTask, setSubTask] = useState('');
    const [description, setDescription] = useState('');
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        if (task) {
            setTaskName(task.taskName || '');
            setDueDate(task.dueDate || '');
            setSelectedTags(task.tags || []);
            setAssignedTo(task.taskAssignedTo || '');
            setStatus(task.status || 'A');
            setSubTask(task.subTask || '');
            setDescription(task.description || '');
        }
    }, [task]);

    // const handleTagSelect = (tags) => {
    //     setSelectedTags(tags);
    // };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (typeof onUpdate !== 'function') {
            console.error('onUpdate is not a function');
            return;
        }

        if (!task) return;

        onUpdate(task.id, {
            ...task,
            taskName,
            dueDate,
            tags: selectedTags,
            taskAssignedTo: assignedTo,
            status,
            subTask,
            description
        });
        onClose();
    };

    return (
        <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflow="hidden">
            <ModalHeader position="sticky" top={0} bg="white" zIndex={1}>Edit Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={0} overflowY="auto" maxH="calc(100vh - 150px)">
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
                            value={dueDate}
                            type='date'
                            onChange={(e) => setDueDate(e.target.value)}
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
                    {showMore && (
                        <>
                            <FormControl mt={4}>
                                <FormLabel>Sub-Task</FormLabel>
                                <Input
                                    placeholder='Enter Sub-Task'
                                    value={subTask}
                                    onChange={(e) => setSubTask(e.target.value)}
                                />
                            </FormControl>
                            <FormControl mt={4}>
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
