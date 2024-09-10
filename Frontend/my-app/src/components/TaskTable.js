import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Select, Button } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

// ........................................................... Table to display tasks
const TaskTable = ({ tasks, onEdit, onDelete, onStatusChange, users }) => {
    console.log('Rendering tasks:', tasks);

    const handleEditClick = (task) => {
        if (onEdit) {
            onEdit(task);
        } else {
            console.error('onEdit function is not defined');
        }
    };

    const handleStatusChange = (taskId, newStatus) => {
        if (onStatusChange) {
            onStatusChange(taskId, newStatus);
        }
    };

    const handleDelete = (task) => {
        if (onDelete) {
            onDelete(task);
        } else {
            console.error('onDelete function is not defined');
        }
    };

    const handleComplete = (task) => {
        console.log('Completing task:', task);
        if (onStatusChange) {
            onStatusChange(task.id, 'Completed');
        } else {
            console.error('onStatusChange function is not defined');
        }
    };

    // Helper function to get the user name by ID
    const getUserNameById = (userId) => {
        console.log('Looking for userId:', userId, 'in users:', users);
        const user = users.find(user => user.id === userId);
        if (user) {
            return user.userName;
        } else {
            console.warn(`User with ID ${userId} not found in users array`);
            return 'Unknown';
        }
    };

    return (
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
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <Tr
                            key={task.id}
                            style={{
                                backgroundColor: index % 2 === 0 ? '#f9e79f' : '#d1f2eb'
                            }}
                        >
                            <Td>{task.taskName}</Td>
                            <Td>{task.dueDate}</Td>
                            <Td>{getUserNameById(task.taskAssignedToID)}</Td> {/* Updated */}
                            <Td>
                                <Select
                                    name="status"
                                    id={`status-${task.id}`}
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    size='sm'
                                    bg='#ffffff'
                                    rounded={7}
                                >
                                    <option value="A">Not Started</option>
                                    <option value="B">In Progress</option>
                                    <option value="D">On Hold</option>
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
                                    onClick={() => handleDelete(task)}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant='solid'
                                    colorScheme='green'
                                    size='sm'
                                    ml={2}
                                    onClick={() => handleComplete(task)}
                                >
                                    Completed
                                </Button>
                            </Td>
                        </Tr>
                    ))
                ) : (
                    <Tr>
                        <Td colSpan={6} textAlign="center" color="gray.500">
                            No tasks available
                        </Td>
                    </Tr>
                )}
            </Tbody>
        </Table>
    );
};

export default TaskTable;
