import React, { useEffect, useState } from 'react';
import { getDeletedTasks, restoreTask } from '../Services/TaskService';
import { Button, useToast, Heading } from '@chakra-ui/react';
import { TbRestore } from 'react-icons/tb';
import { getTags } from '../Services/TagService'; 

const Bin = ({ users }) => {
    const [deletedTasks, setDeletedTasks] = useState([]);
    const [error, setError] = useState(null);
    const toast = useToast();
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchDeletedTasks = async () => {
            try {
                const response = await getDeletedTasks();
                setDeletedTasks(response.data);
            } catch (err) {
                setError('Failed to fetch deleted tasks.');
                console.error(err);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await getTags();
                setTags(response.data); 
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchDeletedTasks();
        fetchTags();
    }, []);

    const handleRestore = async (taskId) => {
        try {
            await restoreTask(taskId);
            setDeletedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
            toast({
                title: "Task Restored",
                description: "The task has been restored successfully!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            setError('Failed to restore task.');
            console.error(err);
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

    return (
        <div>
            <Heading as='h2' size='xl' paddingLeft={3} mb={3} sx={{
                background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
            }}>
                Deleted Tasks
            </Heading>
            {error && <p className="error">{error}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                <thead>
                    <tr>
                        <th style={{ width: '40%', padding: '10px', textAlign: 'left', backgroundColor: '#f7fafc' }}>Task Name</th>
                        <th style={{ width: '20%', padding: '10px', textAlign: 'left', backgroundColor: '#f7fafc' }}>Tags</th>
                        <th style={{ width: '20%', padding: '10px', textAlign: 'left', backgroundColor: '#f7fafc' }}>Assigned To</th>
                        <th style={{ width: '20%', padding: '10px', textAlign: 'left', backgroundColor: '#f7fafc' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {deletedTasks.length > 0 ? (
                        deletedTasks.map((task, index) => (
                            <tr key={task.id} style={{ backgroundColor: index % 2 === 0 ? '#ebfff0' : '#d7f2ff' }}>
                                <td style={{ padding: '10px' }}>{task.taskName}</td>
                                <td style={{ padding: '10px' }}>
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
                                    <Button
                                        colorScheme="teal"
                                        onClick={() => handleRestore(task.id)}
                                        leftIcon={<TbRestore />}
                                    >
                                        Restore
                                    </Button>
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
        </div>
    );
};

export default Bin;