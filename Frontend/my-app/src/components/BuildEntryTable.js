import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box } from '@chakra-ui/react';
import { getUsers } from '../Services/UserService';
import { markTaskWorking, markTaskNotWorking } from '../Services/BuildService';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import jwt_decode from 'jwt-decode';

const BuildEntryTable = ({ build, sections }) => {
    const [, setUsernames] = useState({});
    const [, setUsers] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersResponse = await getUsers();
                setUsers(usersResponse.data || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                setUserId(decodedToken.id);
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        }
    }, []);

    useEffect(() => {
        const savedUsernames = JSON.parse(localStorage.getItem('usernames')) || {};
        setUsernames(savedUsernames);
    }, []);

    const getSectionNameById = (sectionId) => {
        const section = sections.find(section => section.id === sectionId);
        return section ? section.sectionName : '-//-';
    };

    const handleMarkWorking = async (taskId) => {
        const payload = { taskId, userId, buildId: build.id };
        try {
            await markTaskWorking(payload);
        } catch (error) {
            console.error('Error marking task as working:', error.response ? error.response.data : error);
        }
    };

    const handleMarkNotWorking = async (taskId) => {
        const payload = { taskId, userId, buildId: build.id };
        try {
            await markTaskNotWorking(payload);
        } catch (error) {
            console.error('Error marking task as not working:', error.response ? error.response.data : error);
        }
    }

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
                            <Th style={{ width: '18%' }}>Application ID</Th>
                            <Th style={{ width: '15%' }}>Deployed On</Th>
                            <Th style={{ width: '15%' }}>Version</Th>
                            <Th style={{ width: '32%' }}>Media</Th>
                            <Th style={{ width: '10%' }}>Updated At</Th>
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
            <br />
            <div className="table-container">
                <Table className="styled_table" variant="simple">
                    <Thead>
                        <Tr>
                            <Th style={{ width: '75%' }}>Tasks Covered In Build</Th>
                            <Th style={{ width: '25%' }}>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {build.tasksForBuild && build.tasksForBuild.length > 0 ? (
                            build.tasksForBuild.map((taskName, index) => (
                                <Tr key={index}>
                                    <Td style={{ whiteSpace: 'pre-wrap' }}>{taskName}</Td>
                                    <Td>
                                        <Box>
                                            <Button
                                                leftIcon={<CheckIcon />}
                                                onClick={() => handleMarkWorking(taskName)}
                                                colorScheme="blue"
                                                variant="outline"
                                                ml={2}>
                                                Working
                                            </Button>
                                            <Button
                                                leftIcon={<CloseIcon />}
                                                onClick={() => handleMarkNotWorking(taskName)}
                                                colorScheme="red"
                                                variant="outline"
                                                ml={2}>
                                                Not Working
                                            </Button>
                                        </Box>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={2}>No tasks available</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
};

export default BuildEntryTable;