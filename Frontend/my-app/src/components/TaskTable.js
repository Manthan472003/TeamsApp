import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Select, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon } from '@chakra-ui/icons';

const TaskTable = ({ tasks, onEdit, onDelete, onStatusChange, users }) => {
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isCompleteOpen, onOpen: onCompleteOpen, onClose: onCompleteClose } = useDisclosure();
    
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [taskToComplete, setTaskToComplete] = useState(null);

    const handleEditClick = (task) => {
        if (onEdit) {
            onEdit(task);
        } else {
            console.error('onEdit function is not defined');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    const handleStatusChange = (taskId, newStatus) => {
        if (onStatusChange) {
            onStatusChange(taskId, newStatus);
        } else {
            console.error('onStatusChange function is not defined');
        }
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        onDeleteOpen();
    };

    const confirmDelete = () => {
        if (onDelete && taskToDelete) {
            onDelete(taskToDelete);
            setTaskToDelete(null);
            onDeleteClose();
        } else {
            console.error('onDelete function is not defined');
        }
    };

    const handleCompleteClick = (task) => {
        setTaskToComplete(task);
        onCompleteOpen();
    };

    const confirmComplete = () => {
        if (onStatusChange && taskToComplete) {
            onStatusChange(taskToComplete.id, 'Completed');
            setTaskToComplete(null);
            onCompleteClose();
        } else {
            console.error('onStatusChange function is not defined');
        }
    };

    const getUserNameById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const filteredTasks = tasks.filter(task => task.status !== 'Completed');

    // Sort tasks by due date in ascending order
    const sortedTasks = filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return (
        <>
            <Table variant='striped' mt={4}>
                <Thead>
                    <Tr>
                        <Th width='30%'>Task Name</Th>
                        <Th width='10%'>Due Date</Th>
                        <Th width='20%'>Assigned To</Th>
                        <Th width='15%'>Status</Th>
                        <Th width='25%'>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedTasks.length > 0 ? (
                        sortedTasks.map((task, index) => (
                            <Tr
                                key={task.id}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#f9e79f' : '#d7f2ff'
                                }}
                            >
                                <Td>{task.taskName}</Td>
                                <Td>{formatDate(task.dueDate)}</Td>
                                <Td>{getUserNameById(task.taskAssignedToID)}</Td>
                                <Td>
                                    <Select
                                        name="status"
                                        id={`status-${task.id}`}
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                        size='sm'
                                        bg='#ffffff'
                                        rounded={7}
                                        isDisabled={task.status === 'Completed'}
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="On Hold">On Hold</option>
                                    </Select>
                                </Td>
                                <Td>
                                    <Button
                                        variant='solid'
                                        colorScheme='green'
                                        size='sm'
                                        leftIcon={<EditIcon />}
                                        onClick={() => handleEditClick(task)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant='solid'
                                        colorScheme='red'
                                        size='sm'
                                        ml={2}
                                        leftIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteClick(task)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant='solid'
                                        colorScheme='green'
                                        size='sm'
                                        ml={2}
                                        leftIcon={<CheckIcon />}
                                        onClick={() => handleCompleteClick(task)}
                                        isDisabled={task.status === 'Completed'}
                                    >
                                        Completed
                                    </Button>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={5} textAlign="center" color="gray.500">
                                No tasks available
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete this task? This action cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={confirmDelete}>
                            Delete
                        </Button>
                        <Button variant='ghost' onClick={onDeleteClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Complete Confirmation Modal */}
            <Modal isOpen={isCompleteOpen} onClose={onCompleteClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Completion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to mark this task as completed? This action cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={confirmComplete}>
                            Complete
                        </Button>
                        <Button variant='ghost' onClick={onCompleteClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TaskTable;
