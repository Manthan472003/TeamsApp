import React, { useState, useEffect, useCallback } from 'react';
import { useDisclosure, IconButton, Checkbox, Button, HStack, useToast } from '@chakra-ui/react';
import { ImBin2 } from "react-icons/im";
import { getTasksBySection } from '../Services/TaskService';

const BuildDashboardTable = ({ tasks, sectionId }) => {
    const { onOpen: onDeleteOpen } = useDisclosure();
    const [, setTaskToDelete] = useState(null);
    const [columnWidths] = useState([200, 150, 150, 100, 100]);
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [selectedTask, setSelectedTask] = useState([]);
    const [, setMenuOpen] = useState(false);
    const toast = useToast();
    const [, setTasksBySection] = useState({}); // Define the state for tasks by section

    const handleSave = () => {
        console.log('selectedTasks:', selectedTask);
        setMenuOpen(false);
    };

    const fetchTasksBySection = useCallback(async (sectionId) => {
        try {
            const response = await getTasksBySection(sectionId);
            if (response && response.data) {
                setTasksBySection(prev => ({ ...prev, [sectionId]: response.data }));
                setFilteredTasks(response.data); // Update filtered tasks with the fetched data
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Fetch Tasks Error:', error);
            toast({
                title: "Error fetching tasks.",
                description: "Unable to fetch tasks. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]);

    useEffect(() => {
        if (sectionId) {
            fetchTasksBySection(sectionId);
        }
    }, [sectionId, fetchTasksBySection]);

    useEffect(() => {
        setFilteredTasks(tasks);
    }, [tasks]);

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        onDeleteOpen();
    };

    const sortedTasks = filteredTasks
        .filter(task => task.status !== 'Completed' && !task.isDelete)
        .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

    const handlePostToQA = () => {
        console.log("Post to QA:", selectedTask);
    };

    return (
        <>
            <style>
                {`
                    .table-container {
                        overflow-x: auto;
                    }
                    .column_resize_table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .column_resize_table th, 
                    .column_resize_table td {
                        padding: 8px;
                        text-align: left;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        border: 1px solid #EFFFFD; 
                    }
                    .column_resize_table th {
                        background-color: #ECF9FF;
                    }
                    .no-tasks {
                        text-align: center;
                        color: gray;
                        padding: 8px;
                    }
                `}
            </style>
            <div className="table-container">
                <table className="column_resize_table">
                    <thead>
                        <tr>
                            {['Application Name', 'Deployed On', 'Version Management', 'Media', 'Updated At'].map((header, index) => (
                                <th key={index} style={{ width: columnWidths[index] }}>
                                    {header}
                                </th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTasks.length > 0 ? (
                            sortedTasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.applicationName}</td>
                                    <td>{task.deployedOn}</td>
                                    <td>{task.versionManagement}</td>
                                    <td>{task.media}</td>
                                    <td>{new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }).format(new Date(task.updatedAt))}</td>
                                    <td>
                                        <IconButton
                                            icon={<ImBin2 size={20} />}
                                            onClick={() => handleDeleteClick(task)}
                                            variant="outline"
                                            title='Delete'
                                            border={0}
                                            colorScheme="red"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="no-tasks">
                                    No tasks available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div>
                {tasks.map(task => (
                    <div key={task.id}>
                        <Checkbox
                            isChecked={selectedTask.includes(task.taskName)} 
                            onChange={() => {
                                setSelectedTask(prev => 
                                    prev.includes(task.taskName)
                                        ? prev.filter(name => name !== task.taskName)
                                        : [...prev, task.taskName]
                                );
                            }}
                        >
                            {task.taskName} 
                        </Checkbox>
                    </div>
                ))}
                <HStack>
                    <Button
                        onClick={handleSave}
                        colorScheme="blue"
                        width="20%"
                        mr={2}
                        mt={2}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={handlePostToQA}
                        colorScheme="green"
                        width="20%"
                        mt={2}
                    >
                        Post to QA
                    </Button>
                </HStack>
            </div>
        </>
    );
};

export default BuildDashboardTable;