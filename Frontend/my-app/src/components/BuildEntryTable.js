import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Input } from '@chakra-ui/react';
import { getUsers } from '../Services/UserService';
import { markTaskWorking, markTaskNotWorking } from '../Services/BuildService';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import jwt_decode from 'jwt-decode';
import { useToast } from "@chakra-ui/react";
import { createMedia } from '../Services/MediaService'; // Import createMedia

const BuildEntryTable = ({ build, sections }) => {
    const [, setUsernames] = useState({});
    const [, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [taskStatus, setTaskStatus] = useState({});
    const [mediaFile, setMediaFile] = useState(null); // State for media file
    const toast = useToast();

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

    const handleMediaUpload = async (taskName) => {
        if (!mediaFile) {
            toast({
                title: "No media file selected.",
                description: "Please select a media file to upload.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await createMedia('Task', taskName, [mediaFile]);
            toast({
                title: "Media uploaded.",
                description: `You have uploaded media for "${taskName}".`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setMediaFile(null); // Reset the file input
        } catch (error) {
            console.error('Error uploading media:', error);
            toast({
                title: "Error uploading media.",
                description: String(error.response ? error.response.data.message : error.message),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleMarkWorking = async (taskName) => {
        const payload = { taskName, userId, buildId: build.id };
        try {
            await markTaskWorking(payload);
            setTaskStatus((prev) => ({ ...prev, [taskName]: 'working' }));
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
                            <Td>
                                {build.mediaLink ? (
                                    <a href={build.mediaLink} target="_blank" rel="noopener noreferrer">View Media</a>
                                ) : (
                                    <Box>
                                        <Input
                                            type="file"
                                            accept="image/*, video/*"
                                            onChange={(e) => setMediaFile(e.target.files[0])}
                                        />
                                        <Button
                                            onClick={() => handleMediaUpload(build.appId)}
                                            colorScheme="teal"
                                            ml={2}
                                            isDisabled={!mediaFile}
                                        >
                                            Upload Media
                                        </Button>
                                    </Box>
                                )}
                            </Td>
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
                                <Tr key={index} bg={getRowColor(taskName)}>
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
