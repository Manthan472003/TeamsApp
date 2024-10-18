import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Text } from '@chakra-ui/react';
import { getTasksBySection } from '../Services/TaskService';
import { getUsers } from '../Services/UserService'; // Importing getUsers
import { markTaskWorking, markTaskNotWorking } from '../Services/BuildService';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

const BuildEntryTable = ({ build, sections, currentUserId }) => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchTasksAndUsers = async () => {
            if (build && build.appId) {
                try {
                    const [tasksResponse, usersResponse] = await Promise.all([
                        getTasksBySection(build.appId),
                        getUsers()
                    ]);
                    setTasks(tasksResponse.data || []);
                    setUsers(usersResponse.data || []);
                } catch (error) {
                    console.error('Error fetching tasks or users:', error);
                    setTasks([]);
                }
            }
        };

        fetchTasksAndUsers();
    }, [build]);

    useEffect(() => {
        const filteredTasks = tasks.filter(task => task.status !== 'Completed' && !task.isDelete && !task.sentToQA);
        setFilteredTasks(filteredTasks);
    }, [tasks]);

    const getSectionNameById = (sectionId) => {
        const section = sections.find(section => section.id === sectionId);
        return section ? section.sectionName : '-//-';
    };

    const getUserNameById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const handleMarkWorking = async (taskId) => {
        const payload = { 
            taskId, 
            userId: currentUserId, 
            buildId: build.appId 
        };
        console.log('Payload for Mark Working:', payload);
    
        try {
            await markTaskWorking(payload);
            const username = getUserNameById(currentUserId);
            setUsernames(prev => ({ ...prev, [taskId]: username }));
        } catch (error) {
            console.error('Error marking task as working:', error.response ? error.response.data : error);
        }
    };
    
    const handleMarkNotWorking = async (taskId) => {
        const payload = { 
            taskId, 
            userId: currentUserId, 
            buildId: build.appId 
        };
        console.log('Payload for Mark Not Working:', payload);
    
        try {
            await markTaskNotWorking(payload);
            const username = getUserNameById(currentUserId);
            setUsernames(prev => ({ ...prev, [taskId]: username }));
        } catch (error) {
            console.error('Error marking task as not working:', error.response ? error.response.data : error);
        }
    };
    

    const [clickedTaskId, setClickedTaskId] = useState(null);

    const handleClick = (taskId) => {
        setClickedTaskId(taskId);
    };

    return (
        <>
            <style>
                {`
                    .table-container {
                        overflow-x: auto;
                    }
                    .styled_table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .styled_table th, 
                    .styled_table td {
                        padding: 8px;
                        text-align: left;
                        border: 1px solid #EFFFFD; 
                    }
                    .styled_table th {
                        background-color: #ECF9FF;
                    }
                    .task-list {
                        margin-top: 20px;
                    }
                `}
            </style>
            <div className="table-container">
                <Table className="styled_table" variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Application ID</Th>
                            <Th>Deployed On</Th>
                            <Th>Version</Th>
                            <Th>Media</Th>
                            <Th>Updated At</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>{getSectionNameById(build.appId)}</Td>
                            <Td>{build.deployedOn}</Td>
                            <Td>{build.versionName}</Td>
                            <Td>{build.mediaLink}</Td>
                            <Td>{new Date(build.updatedAt).toLocaleDateString()}</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </div>
            <Box className="task-list">
                <Text fontSize='xl' fontWeight='bold' color='#149edf'>Tasks :</Text>
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <div
                            key={task.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: clickedTaskId === task.id ? '#e0f7fa' : 'transparent', 
                                transition: 'background-color 0.1s', 
                            }}
                            onClick={() => handleClick(task.id)} 
                        >
                            <span>{task.taskName}</span>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    onClick={(e) => { e.stopPropagation(); handleMarkWorking(task.id); }}
                                    colorScheme={usernames[task.id] === getUserNameById(currentUserId) ? 'green' : 'blue'}
                                    variant="outline"
                                    ml={2}
                                    mb={2}
                                    leftIcon={<CheckIcon size={15} />}
                                    height={7}
                                    width={110}
                                    borderRadius={4}
                                >
                                    Working
                                </Button>
                                <Button
                                    onClick={(e) => { e.stopPropagation(); handleMarkNotWorking(task.id); }}
                                    colorScheme={usernames[task.id] === getUserNameById(currentUserId) ? 'red' : 'orange'}
                                    variant="outline"
                                    ml={2}
                                    mb={2}
                                    leftIcon={<CloseIcon size={9} />}
                                    height={7}
                                    width={140}
                                    borderRadius={4}
                                >
                                    Not Working
                                </Button>
                                {usernames[task.id] && <div style={{ marginLeft: '8px' }}>Clicked by: {usernames[task.id]}</div>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No tasks available</div>
                )}
            </Box>

        </>
    );
};

export default BuildEntryTable;