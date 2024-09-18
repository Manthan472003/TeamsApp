import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Select, Button, HStack, Tag, TagLabel, useDisclosure } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon } from '@chakra-ui/icons';
import { getTags } from '../Services/TagService'; // Adjust import according to your file structure
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ConfirmCompleteModal from './ConfirmCompleteModal';

const TaskTable = ({ tasks, onEdit, onDelete, onStatusChange, users }) => {
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isCompleteOpen, onOpen: onCompleteOpen, onClose: onCompleteClose } = useDisclosure();

    const [taskToDelete, setTaskToDelete] = useState(null);
    const [taskToComplete, setTaskToComplete] = useState(null);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getTags();
                setTags(response.data); // Assuming response.data contains the array of tags
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    const handleEditClick = (task) => {
        if (onEdit) {
            onEdit(task);
        } else {
            console.error('onEdit function is not defined');
        }
    };
    

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); 
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleStatusChange = (taskId, newStatus) => {
        if (onStatusChange) {
            onStatusChange(taskId, newStatus);
        } else {
            console.error('onStatusChange function is not defined');
        }
    };

    const getTagNamesByIds = (tagIds) => {
        const tagMap = new Map(tags.map(tag => [tag.id, tag.tagName]));

        return tagIds.map(id => {
            const tagName = tagMap.get(id);
            if (!tagName) {
                console.error(`No tag found for ID: ${id}`);
                return 'Unknown';
            }
            return tagName;
        });
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

    // Remove the filtering of completed tasks
    const sortedTasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return (
        <>
            <Table variant='striped' mt={4} style={{ tableLayout: 'fixed' }}>
                <Thead>
                    <Tr>
                        <Th width='27%'>Task Name</Th>
                        <Th width='17%' style={{ whiteSpace: 'normal' }}>Tags</Th>
                        <Th width='10%'>Due Date</Th>
                        <Th width='11%'>Assigned To</Th>
                        <Th width='12%'>Status</Th>
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
                                <Td style={{ whiteSpace: 'normal', overflow: 'hidden' }}>
                                    <HStack spacing={2} style={{ flexWrap: 'wrap' }}>
                                        {getTagNamesByIds(task.tagIDs || []).map((tagName, idx) => (
                                            <Tag
                                                size='md'
                                                key={idx}
                                                borderRadius='6px'
                                                variant='solid'
                                                colorScheme='green'
                                            >
                                                <TagLabel>{tagName}</TagLabel>
                                            </Tag>
                                        ))}
                                    </HStack>
                                </Td>
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

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onConfirm={confirmDelete}
                itemName={taskToDelete ? taskToDelete.taskName : ''}
            />

            {/* Complete Confirmation Modal */}
            <ConfirmCompleteModal
                isOpen={isCompleteOpen}
                onClose={onCompleteClose}
                onConfirm={confirmComplete}
                itemName={taskToComplete ? taskToComplete.taskName : ''}
            />
        </>
    );
};

export default TaskTable;
