import React, { useRef, useState } from 'react';
import {
    Select, Button, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl, FormLabel, Input,
    ModalCloseButton,Stack,Tag,TagLabel
} from '@chakra-ui/react';
import TagDropdown from './TagDropdown';


//........................................................... Modal for editing a task
const EditTaskModal = ({ isOpen, onClose, task, onSubmit }) => {
    const initialRef = useRef(null);
    const [taskName, setTaskName] = useState(task.taskName || '');
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [selectedTags, setSelectedTags] = useState(task.tags || []);
    const [assignedTo, setAssignedTo] = useState(task.taskAssignedTo || '');
    const [status, setStatus] = useState(task.status || 'A');
    const [subTask, setSubTask] = useState(task.subTask || '');
    const [description, setDescription] = useState(task.description || '');
    const [showMore, setShowMore] = useState(false);

    const handleTagSelect = (tags) => {
        setSelectedTags(tags);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(task.id, {
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
                            <FormLabel>Tags</FormLabel>
                            <TagDropdown
                                selectedTags={selectedTags}
                                onTagSelect={handleTagSelect}
                            />
                            <Stack spacing={2} mt={2}>
                                {selectedTags.map(tag => (
                                    <Tag key={tag} colorScheme="teal">
                                        <TagLabel>{tag}</TagLabel>
                                    </Tag>
                                ))}
                            </Stack>
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

export default EditTaskModal
