import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, IconButton, Text } from '@chakra-ui/react';
import { markTaskWorking, markTaskNotWorking, isTaskWorking, getCheckedTaskDetails } from '../Services/BuildService';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import jwt_decode from 'jwt-decode';
import { useToast } from "@chakra-ui/react";
import MediaUploaderForBuild from './MediaUploaderForBuild';

const BuildEntryTable = ({ build, sections }) => {
    const [userId, setUserId] = useState('');
    const [taskStatus, setTaskStatus] = useState({});
    const [checkedDetails, setCheckedDetails] = useState({});
    const toast = useToast();

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
        const fetchTaskStatuses = async () => {
            const statuses = {};
            for (const taskName of build.tasksForBuild) {
                try {
                    const response = await isTaskWorking({ taskName, buildId: build.id });
                    statuses[taskName] = response.data.isWorking ? 'working' : 'not working';
                    await fetchCheckedTaskDetails(taskName); // Fetch details initially
                } catch (error) {
                    console.error(`Error fetching status for task ${taskName}:`, error);
                    statuses[taskName] = 'unknown'; // Handle error
                }
            }
            setTaskStatus(statuses);
        };

        if (build.tasksForBuild && build.tasksForBuild.length > 0) {
            fetchTaskStatuses();
        }
    }, [build]);

    const fetchCheckedTaskDetails = async (taskName) => {
        try {
            
            const response = await getCheckedTaskDetails(build.id, taskName);
            setCheckedDetails((prev) => ({
                ...prev,
                [taskName]: response.data
            }));
        } catch (error) {
            console.error(`Error fetching checked task details for ${taskName}:`, error);
        }
    };

    const getSectionNameById = (sectionId) => {
        const section = sections.find(section => section.id === sectionId);
        return section ? section.sectionName : '-//-';
    };

    const handleMarkWorking = async (taskName) => {
        const payload = { taskName, userId, buildId: build.id };
        try {
            await markTaskWorking(payload);
            setTaskStatus((prev) => ({ ...prev, [taskName]: 'working' }));
            await fetchCheckedTaskDetails(taskName); // Fetch details after marking
            toast({
                title: "Task marked as working.",
                description: `You have marked "${taskName}" as working.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error marking task as working:', error);
            const errorMessage = error.response ? error.response.data.message || "An unexpected error occurred." : "An unexpected error occurred.";
            toast({
                title: "Error marking task as working.",
                description: String(errorMessage),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleMarkNotWorking = async (taskName) => {
        const payload = { taskName, userId, buildId: build.id };
        try {
            await markTaskNotWorking(payload);
            setTaskStatus((prev) => ({ ...prev, [taskName]: 'not working' }));
            await fetchCheckedTaskDetails(taskName); // Fetch details after marking
            toast({
                title: "Task marked as not working.",
                description: `You have marked "${taskName}" as not working.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error marking task as not working:', error);
            const errorMessage = error.response ? error.response.data.message || "An unexpected error occurred." : "An unexpected error occurred.";
            toast({
                title: "Error marking task as not working.",
                description: String(errorMessage),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const getRowColor = (taskName) => {
        if (taskStatus[taskName] === 'working') return 'green.100';
        if (taskStatus[taskName] === 'not working') return 'red.100';
        return 'white';
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
                `}
            </style>
            <div className="table-container">
                <Table className="styled_table" variant="simple">
                    <Thead>
                        <Tr>
                            <Th style={{ width: '20%' }}>Application</Th>
                            <Th style={{ width: '20%' }}>Deployed On</Th>
                            <Th style={{ width: '20%' }}>Version</Th>
                            <Th style={{ width: '20%' }}>Media</Th>
                            <Th style={{ width: '20%' }}>Updated At</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>{getSectionNameById(build.appId)}</Td>
                            <Td>{build.deployedOn}</Td>
                            <Td>{build.versionName}</Td>
                            <Td>
                                <MediaUploaderForBuild buildId={build.id} />
                            </Td>
                            <Td>
                                {build.updatedAt ? new Intl.DateTimeFormat('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }).format(new Date(build.updatedAt)) : ''}
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </div>
            <br />
            <div className="table-container">
                <Table className="styled_table" variant="simple">
                    <Thead>
                        <Tr>
                            <Th style={{ width: '90%' }}>Tasks Covered In Build</Th>
                            <Th style={{ width: '10%' }}>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {build.tasksForBuild && build.tasksForBuild.length > 0 ? (
                            build.tasksForBuild.map((taskName, index) => (
                                <Tr key={index} bg={getRowColor(taskName)}>
                                    <Td style={{ whiteSpace: 'pre-wrap' }}>{taskName}</Td>
                                    <Td>
                                        <Box>
                                            <IconButton
                                                icon={<CheckIcon size={25} />}
                                                onClick={() => handleMarkWorking(taskName)}
                                                variant="outline"
                                                title='Working'
                                                colorScheme="blue"
                                                border={0}
                                                mr={2}
                                                isDisabled={taskStatus[taskName] === 'working'}
                                            />
                                            <IconButton
                                                icon={<CloseIcon size={25} />}
                                                onClick={() => handleMarkNotWorking(taskName)}
                                                variant="outline"
                                                title='Not Working'
                                                colorScheme="red"
                                                border={0}
                                                mr={2}
                                                isDisabled={taskStatus[taskName] === 'not working'}
                                            />
                                        </Box>
                                        {checkedDetails[taskName] && (
                                            <Text fontSize="sm" mt={2}>
                                                Task marked as {checkedDetails[taskName].isWorking ? "working" : "not working"} by User ID: {checkedDetails[taskName].checkedByUserId}
                                            </Text>
                                        )}
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
