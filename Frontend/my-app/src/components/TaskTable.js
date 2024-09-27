import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { getTags } from '../Services/TagService';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ConfirmCompleteModal from './ConfirmCompleteModal';
import ViewTaskDrawer from './ViewTaskDrawer';

const TaskTable = ({ tasks, onEdit, onDelete, onStatusChange, users }) => {
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isCompleteOpen, onClose: onCompleteClose } = useDisclosure();
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

    const [taskToDelete, setTaskToDelete] = useState(null);
    const [taskToComplete, setTaskToComplete] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [columnWidths, setColumnWidths] = useState([200, 200, 100, 100, 100, 50]); // Initial widths

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

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleStatusChange = (taskId, newStatus) => {
        if (onStatusChange) {
            onStatusChange(taskId, newStatus);
        }
    };

    const getTagNamesByIds = (tagIds) => {
        const tagMap = new Map(tags.map(tag => [tag.id, tag.tagName]));
        return tagIds.map(id => tagMap.get(id) || 'Unknown');
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        onDeleteOpen();
    };

    const confirmDelete = () => {
        if (onDelete && taskToDelete) {
            onDelete(taskToDelete);
            setTaskToDelete(null);
            onDeleteClose();
        }
    };

    const confirmComplete = () => {
        if (onStatusChange && taskToComplete) {
            onStatusChange(taskToComplete.id, 'Completed');
            setTaskToComplete(null);
            onCompleteClose();
        }
    };

    const getUserNameById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const sortedTasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        onDrawerOpen();
    };

    const startResize = (index, e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = columnWidths[index];

        const onMouseMove = (moveEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            setColumnWidths((prevWidths) => {
                const updatedWidths = [...prevWidths];
                updatedWidths[index] = Math.max(newWidth, 50); // Minimum width
                return updatedWidths;
            });
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
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
                        border: 1px solid #9e9e9e; 
                    }
                    .column_resize_table th {
                        background-color: #f1f1f1;
                    }
                    .tag {
                        background-color: green;
                        color: white;
                        padding: 4px 8px;
                        border-radius: 6px;
                        margin-right: 8px;
                    }
                    .status-select {
                        padding: 4px;
                        border-radius: 7px;
                        border: 1px solid #ccc;
                        background-color: #fff;
                    }
                    .delete-button {
                        background-color: red;
                        color: white;
                        border: none;
                        padding: 6px;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .no-tasks {
                        text-align: center;
                        color: gray;
                        padding: 8px;
                    }
                    .resizer {
                        cursor: ew-resize;
                        width: 10px;
                        display: inline-block;
                        height: 100%;
                        position: absolute;
                        right: 0;
                        top: 0;
                        z-index: 1;
                    }
                `}
            </style>
            <div className="table-container">
                <table className="column_resize_table">
                    <thead>
                        <tr>
                            {['Task Name', 'Tags', 'Due Date', 'Assigned To', 'Status', 'Action'].map((header, index) => (
                                <th key={index} style={{ position: 'relative', width: columnWidths[index] }}>
                                    {header}
                                    {index < columnWidths.length - 1 && (
                                        <span
                                            className="resizer"
                                            onMouseDown={(e) => startResize(index, e)}
                                        />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTasks.length > 0 ? (
                            sortedTasks.map((task, index) => (
                                <tr key={task.id} style={{ backgroundColor: index % 2 === 0 ? '#ebfff0' : '#d7f2ff' }}>
                                <td style={{cursor: 'pointer'}} onClick={() => handleTaskClick(task)} >{task.taskName}</td>
                                <td>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {getTagNamesByIds(task.tagIDs || []).map((tagName, idx) => (
                                                <span key={idx} className="tag">
                                                    {tagName}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{cursor: 'pointer'}} onClick={() => handleTaskClick(task)}>{formatDate(task.dueDate)}</td>
                                    <td style={{cursor: 'pointer'}} onClick={() => handleTaskClick(task)}>{getUserNameById(task.taskAssignedToID)}</td>
                                    <td style={{cursor: 'pointer'}} onClick={() => handleTaskClick(task)}>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="Not Started">Not Started</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="On Hold">On Hold</option>
                                        </select>
                                    </td>
                                    <td >
                                        <button className="delete-button" onClick={() => handleDeleteClick(task)}>
                                            <MdOutlineDeleteOutline />
                                        </button>
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

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onConfirm={confirmDelete}
                itemName={taskToDelete ? taskToDelete.taskName : ''}
            />

            <ConfirmCompleteModal
                isOpen={isCompleteOpen}
                onClose={onCompleteClose}
                onConfirm={confirmComplete}
                itemName={taskToComplete ? taskToComplete.taskName : ''}
            />

            <ViewTaskDrawer
                isOpen={isDrawerOpen}
                onClose={onDrawerClose}
                task={selectedTask}
                users={users}
                tags={tags}
            />
        </>
    );
};

export default TaskTable;