import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, HStack, Tag, TagLabel, useDisclosure } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons'; // Updated icon for Restore button
import { getTags } from '../Services/TagService'; // Adjust import according to your file structure
import ConfirmRestoreModal from './ConfirmRestoreModal'; // Import ConfirmRestoreModal

const CompletedTaskTable = ({ tasks, onStatusChange, users }) => {
    const { isOpen: isRestoreOpen, onOpen: onRestoreOpen, onClose: onRestoreClose } = useDisclosure();

    const [taskToRestore, setTaskToRestore] = useState(null);
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

    const handleRestoreClick = (task) => {
        setTaskToRestore(task);
        onRestoreOpen();
    };

    const confirmRestore = () => {
        if (onStatusChange && taskToRestore) {
            console.log('Attempting to restore task:', taskToRestore); // Debugging output
            onStatusChange(taskToRestore.id, 'Not Started');
            setTaskToRestore(null);
            onRestoreClose();
        } else {
            console.error('onStatusChange function is not defined or taskToRestore is missing');
        }
    };

    const getUserNameById = (userId) => {
        if (!users || users.length === 0) {
            console.error('Users data is not available');
            return 'Unknown';
        }

        const user = users.find(user => user.id === userId);
        if (!user) {
            console.error(`No user found for ID: ${userId}`);
            return 'Unknown';
        }
        return user.userName;
    };

    // No need to sort by dueDate since the column is removed
    const sortedTasks = tasks;

    return (
        <>
            <Table variant='striped' mt={4} style={{ tableLayout: 'fixed' }}>
                <Thead>
                    <Tr>
                        <Th width='40%'>Task Name</Th>
                        <Th width='20%' style={{ whiteSpace: 'normal' }}>Tags</Th>
                        <Th width='20%'>Assigned To</Th>
                        <Th width='20%'>Action</Th>
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
                                <Td>{getUserNameById(task.taskAssignedToID)}</Td>
                                <Td>
                                    <Button
                                        variant='solid'
                                        colorScheme='green'
                                        size='sm'
                                        leftIcon={<RepeatIcon />}
                                        onClick={() => handleRestoreClick(task)}
                                    >
                                        Restore
                                    </Button>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={4} textAlign="center" color="gray.500">
                                No tasks available
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>

            {/* Restore Confirmation Modal */}
            <ConfirmRestoreModal
                isOpen={isRestoreOpen}
                onClose={onRestoreClose}
                onConfirm={confirmRestore}
                itemName={taskToRestore ? taskToRestore.taskName : ''}
            />
        </>
    );
};

export default CompletedTaskTable;
