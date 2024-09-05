import React from 'react'
import {
    Table, Thead, Tbody, Tr, Th, Td, Tag, TagLabel, Select, Button, Checkbox} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

// ...........................................................Table to display tasks
const TaskTable = ({ tasks = [], onEdit, onDelete }) => {
    const handleStatusChange = (taskId, newStatus) => {
        console.log(`Update status of task ${taskId} to ${newStatus}`);
    };

    return (
        <Table variant='simple' mt={4}>
            <Thead>
                <Tr>
                    <Th>Task Name</Th>
                    <Th>Due Date</Th>
                    <Th>Tags</Th>
                    <Th>Assigned To</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                </Tr>
            </Thead>
            <Tbody>
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <Tr key={task.id}>
                            <Td>{task.taskName}</Td>
                            <Td>{task.dueDate}</Td>
                            <Td>
                                {task.tags.map((tag, idx) => (
                                    <Tag key={idx} colorScheme='green' mr={2}>
                                        <TagLabel>{tag}</TagLabel>
                                    </Tag>
                                ))}
                            </Td>
                            <Td>{task.taskAssignedTo}</Td>
                            <Td>
                                <Select
                                    name="status"
                                    id={`status-${task.id}`}
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
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
                                    onClick={() => onEdit(task)}
                                >
                                    Show More
                                </Button>
                                <Button
                                    variant='solid'
                                    colorScheme='red'
                                    size='sm'
                                    ml={2}
                                    leftIcon={<DeleteIcon />}
                                    onClick={() => onDelete(task)}
                                >
                                    Delete
                                </Button>
                            </Td>
                            <Td>
                                <Checkbox ml={2} mr={1} size='lg' colorScheme='green'>
                                    COMPLETED
                                </Checkbox>
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

export default TaskTable
