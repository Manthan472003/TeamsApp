import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Box } from '@chakra-ui/react';
import { getTasksBySection } from '../Services/TaskService';

const BuildEntryTable = ({ build, sections }) => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (build && build.appId) {
                try {
                    const response = await getTasksBySection(build.appId);
                    if (response && response.data) {
                        setTasks(response.data); // Assuming response.data is an array of tasks
                    } else {
                        setTasks([]); // Handle unexpected response
                    }
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                    setTasks([]); // Handle errors by clearing tasks
                }
            }
        };

        fetchTasks();
    }, [build]);

    useEffect(() => {
        const filteredTasks = tasks.filter(task => task.status !== 'Completed' && !task.isDelete && !task.sentToQA);
        setFilteredTasks(filteredTasks);
    }, [tasks]);

    // Ensure sections is an array
    if (!Array.isArray(sections)) {
        console.error('Sections data is not available', sections);
        return null; // Render nothing if sections are not provided
    }

    const getSectionNameById = (sectionId) => {
        const section = sections.find(section => section.id === sectionId);
        return section ? section.sectionName : '-//-';
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
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
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
                <h3>Tasks:</h3>
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <div key={task.id}>
                            <Checkbox>{task.taskName}</Checkbox> {/* Adjust property based on your task structure */}
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
