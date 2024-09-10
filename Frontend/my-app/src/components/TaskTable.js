import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Select, Button } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const TaskTable = ({ tasks, onEdit, onDelete, onStatusChange, users }) => {
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
        } else {
            console.error('onStatusChange function is not defined');
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
        if (onStatusChange) {
            onStatusChange(task.id, 'Completed');
        } else {
            console.error('onStatusChange function is not defined');
        }
    };

    const getUserNameById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const filteredTasks = tasks.filter(task => task.status !== 'Completed');

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
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => (
                        <Tr
                            key={task.id}
                            style={{
                                backgroundColor: index % 2 === 0 ? '#f9e79f' : '#d7f2ff'
                            }}
                        >
                            <Td>{task.taskName}</Td>
                            <Td>{task.dueDate}</Td>
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
    );
};

export default TaskTable;
