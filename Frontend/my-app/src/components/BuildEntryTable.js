import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Text } from '@chakra-ui/react';
import { getTasksBySection } from '../Services/TaskService';
import { getUsers } from '../Services/UserService'; 
import { markTaskWorking, markTaskNotWorking } from '../Services/BuildService';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import jwt_decode from 'jwt-decode';

const BuildEntryTable = ({ build, sections }) => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [rowColors, setRowColors] = useState({}); // Manage row colors

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                setUserId(decodedToken.id);
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        } else {
            console.error('No token found in local storage');
        }
    }, []);

    useEffect(() => {
        const savedUsernames = JSON.parse(localStorage.getItem('usernames')) || {};
        const savedRowColors = JSON.parse(localStorage.getItem('rowColors')) || {};
        setUsernames(savedUsernames);
        setRowColors(savedRowColors);
    }, []);

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
            userId: userId,
            buildId: build.id
        };
        console.log('Payload for Mark Working:', payload);

        try {
            await markTaskWorking(payload);
            const username = getUserNameById(userId);
            setUsernames(prev => {
                const newUsernames = { ...prev, [taskId]: username };
                localStorage.setItem('usernames', JSON.stringify(newUsernames)); // Save to localStorage
                return newUsernames;
            });
            setRowColors(prev => {
                const newRowColors = { ...prev, [taskId]: '#88E788' }; // Light green for working
                localStorage.setItem('rowColors', JSON.stringify(newRowColors)); // Save to localStorage
                return newRowColors;
            });
        } catch (error) {
            console.error('Error marking task as working:', error.response ? error.response.data : error);
        }
    };

    const handleMarkNotWorking = async (taskId) => {
        const payload = {
            taskId,
            userId: userId,
            buildId: build.id
        };
        console.log('Payload for Mark Not Working:', payload);

        try {
            await markTaskNotWorking(payload);
            const username = getUserNameById(userId);
            setUsernames(prev => {
                const newUsernames = { ...prev, [taskId]: username };
                localStorage.setItem('usernames', JSON.stringify(newUsernames)); // Save to localStorage
                return newUsernames;
            });
            setRowColors(prev => {
                const newRowColors = { ...prev, [taskId]: '#ffcccb' }; // Light red for not working
                localStorage.setItem('rowColors', JSON.stringify(newRowColors)); // Save to localStorage
                return newRowColors;
            });
        } catch (error) {
            console.error('Error marking task as not working:', error.response ? error.response.data : error);
        }
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
                                backgroundColor: rowColors[task.id] || 'transparent',
                                transition: 'background-color 0.1s',
                            }}
                        >
                            <span>{task.taskName}</span>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    onClick={(e) => { e.stopPropagation(); handleMarkWorking(task.id); }}
                                    colorScheme="blue"
                                    variant="outline"
                                    ml={2}
                                    mt={2}
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
                                    colorScheme="red"
                                    variant="outline"
                                    ml={2}
                                    mb={2}
                                    mt={2}
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
