import React, { useState, useEffect } from 'react';
import { useDisclosure, IconButton, Checkbox, Button, HStack } from '@chakra-ui/react';
import { ImBin2 } from "react-icons/im";
import { getTags } from '../Services/TagService';

const BuildDashboardTable = ({ tasks, onStatusChange, users }) => {
    const { onOpen: onDeleteOpen } = useDisclosure();
    const [, setTaskToDelete] = useState(null);
    const [, setTags] = useState([]);
    const [columnWidths] = useState([200, 200, 150, 100, 100]); // Adjust as needed
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [selectedTags, setSelectedTags] = useState([]);
    const [, setMenuOpen] = useState(false);

    const handleSave = () => {
        console.log('Selected Tags:', selectedTags);
        setMenuOpen(false); // Close the dropdown after saving
    };

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getTags();
                setTags(response.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    useEffect(() => {
        setFilteredTasks(tasks);
    }, [tasks]);

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        onDeleteOpen();
    };

    const sortedTasks = filteredTasks
        .filter(task => task.status !== 'Completed' && !task.isDelete)
        .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)); // Sort by updated date

    const handleTagChange = (tag) => {
        setSelectedTags(prevSelected =>
            prevSelected.includes(tag)
                ? prevSelected.filter(t => t !== tag)
                : [...prevSelected, tag]
        );
    };

    const handlePostToQA = () => {
        console.log("Post to QA:", selectedTags);
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
                            {['Application Name', 'Deployed on', 'Version Management', 'Media', 'Updated At'].map((header, index) => (
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
                                    <td>{new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }).format(new Date(task.deployedOn))}</td>
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
                {['Tag 1', 'Tag 2', 'Tag 3'].map(tag => (
                    <div key={tag}>
                        <Checkbox
                            isChecked={selectedTags.includes(tag)}
                            onChange={() => handleTagChange(tag)}
                        >
                            {tag}
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