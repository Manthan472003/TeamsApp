import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { TbRestore } from "react-icons/tb";
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
            <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden', marginTop: '16px', tableLayout: 'fixed' }}>
                <thead style={{ backgroundColor: '#f7fafc' }}>
                    <tr>
                        <th style={{ width: '40%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Task Name</th>
                        <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left', whiteSpace: 'normal' }}>Tags</th>
                        <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Assigned To</th>
                        <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTasks.length > 0 ? (
                        sortedTasks.map((task, index) => (
                            <tr
                                key={task.id}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#ebfff0' : '#d7f2ff'
                                }}
                            >
                                <td style={{ padding: '10px' }}>{task.taskName}</td>
                                <td style={{ padding: '10px', whiteSpace: 'normal', overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {getTagNamesByIds(task.tagIDs || []).map((tagName, idx) => (
                                            <span key={idx} style={{
                                                display: 'inline-block',
                                                backgroundColor: '#48bb78',
                                                color: 'white',
                                                borderRadius: '6px',
                                                padding: '4px 8px',
                                                margin: '2px'
                                            }}>
                                                {tagName}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '10px' }}>{getUserNameById(task.taskAssignedToID)}</td>
                                <td style={{ padding: '10px' }}>
                                    <button
                                        style={{
                                            backgroundColor: '#48bb78',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                        leftIcon={<TbRestore />}
                                        onClick={() => handleRestoreClick(task)}
                                    >
                                        Restore
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: '#a0aec0', padding: '10px' }}>
                                No tasks available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>


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
