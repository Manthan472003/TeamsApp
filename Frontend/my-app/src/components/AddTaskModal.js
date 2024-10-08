import React, { useRef, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import {
    Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
    Button, FormControl, FormLabel, Input, Select, useToast, SimpleGrid, Box
} from '@chakra-ui/react';
import UserDropdown from './UserDropdown';
import TagDropdown from './TagDropdown';
import { getSections } from '../Services/SectionService';
import { saveTask } from '../Services/TaskService';
import { sendEmail } from '../Services/MailService';
import { getUser } from '../Services/UserService';
import { getTags } from '../Services/TagService';
import { IoIosSave, IoMdCloseCircleOutline } from "react-icons/io";
import { createNotification } from '../Services/NotificationService';

const AddTaskModal = ({ isOpen, onClose, onSubmit, userId: propUserId, sectionID, sectionName }) => {
    const initialRef = useRef(null);
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [assignedUserEmail, setAssignedUserEmail] = useState('');
    const [createdByUserName, setCreatedByUserName] = useState('');
    const [status, setStatus] = useState('Not Started');
    const [platformType, setPlatformType] = useState('Platform-Independent');
    const [selectedTags, setSelectedTags] = useState([]);
    const [sections, setSections] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedSection, setSelectedSection] = useState(sectionID || '');
    const [userId, setUserId] = useState(propUserId || '');
    const [, setAssignedUserName] = useState('');
    
    const toast = useToast();

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await getSections();
                if (response && response.data) {
                    setSections(response.data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await getTags();
                if (response && response.data) {
                    setTags(response.data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchSections();
        fetchTags();

        if (!propUserId) {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id);
                setCreatedByUserName(decodedToken.userName);
            } else {
                console.error('No token found in local storage');
            }
        } else {
            setUserId(propUserId);
        }
    }, [propUserId]);

    useEffect(() => {
        setSelectedSection(sectionID || '');
    }, [sectionID]);

    const resetForm = () => {
        setTaskName('');
        setDueDate('');
        setAssignedTo('');
        setAssignedUserEmail('');
        setStatus('Not Started');
        setPlatformType('Platform-Independent');
        setSelectedTags([]);
        setSelectedSection(sectionID || '');
    };

    const handleUserSelect = async (userId) => {
        setAssignedTo(userId);
        try {
            const response = await getUser(userId);
            setAssignedUserEmail(response.data.email);
            setAssignedUserName(response.data.userName);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleTagSelect = (tags) => {
        setSelectedTags(tags);
    };

    const getTagNamesByIds = (tagIds) => {
        const tagMap = new Map(tags.map(tag => [tag.id, tag.tagName]));
        return tagIds.map(id => tagMap.get(id) || 'Unknown');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validTagIDs = selectedTags.filter(id => id != null);

        const task = {
            taskName,
            taskAssignedToID: assignedTo,
            taskCreatedByID: parseInt(userId, 10),
            status,
            platformType,
            sectionID: selectedSection,
            tagIDs: validTagIDs,
        };

        if (dueDate) {
            task.dueDate = dueDate;
        }

        try {
            const newTask = await saveTask(task);
            onSubmit(newTask);

            const notificationText = `New task created:\n${taskName}`;
            const userIds = [assignedTo, userId].filter(id => typeof id === 'number' && id > 0);

            if (userIds.length > 0) {
                await createNotification({ notificationText, userIds });
            }

            onClose();
            resetForm();

            if (assignedUserEmail) {
                const tagNames = getTagNamesByIds(validTagIDs).join(', ');

                const emailContent = {
                    email: assignedUserEmail,
                    subject: `New Task Assigned: ${taskName}`,
                    text: `You have been assigned a new task: ${taskName}. Due date: ${dueDate || 'Not specified'}.`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h1 style="color: #007BFF;">New Task Assigned</h1>
                            <p style="font-size: 16px;">You have been assigned a new task:</p>
                            <h2 style="color: #333;">Task Name: <strong>${taskName}</strong></h2>
                            <p><strong>Due Date:</strong> ${dueDate || 'Not specified'}</p>
                            <p><strong>Created By:</strong> ${createdByUserName}</p>
                            <p><strong>Status:</strong> ${status}</p>
                            <p><strong>Platform Type:</strong> ${platformType}</p>
                            <p><strong>Tags:</strong> ${tagNames || 'None'}</p>
                            <p style="margin-top: 20px;">Thank you!</p>
                        </div>
                    `,
                };

                await sendEmail(emailContent);
            }

        } catch (error) {
            console.error('Error adding task:', error);
            toast({
                title: "Error adding task.",
                description: error.response?.data?.message || "An error occurred while adding the task.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const buttonStyles = {
        base: {
            fontSize: '23px',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundImage: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
            padding: '8px 6px',
            borderRadius: '0 0 0 0',
            transition: 'all 0.3s ease',
            marginBottom: '2px',
            width: '100%',
            textAlign: 'left',
            justifyContent: 'start',
            paddingLeft: '20px',
        },
    };

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            size="xl"
            closeOnOverlayClick={false}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader sx={buttonStyles.base}>Add Task</DrawerHeader>
                <DrawerBody>
                    <form onSubmit={handleSubmit}>
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl mb={4}>
                                <FormLabel>Section</FormLabel>
                                <Select
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                >
                                    <option value="">Select Section</option>
                                    {sections.map(section => (
                                        <option key={section.id} value={section.id}>
                                            {section.sectionName}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Add Platform For Section</FormLabel>
                                <Select
                                    value={platformType}
                                    onChange={(e) => setPlatformType(e.target.value)}
                                >
                                    <option value="Platform-Independent">Platform-Independent</option>
                                    <option value="iOS">iOS</option>
                                    <option value="Android">Android</option>
                                    <option value="Web">MacOS</option>
                                    <option value="WindowsOS">WindowsOS</option>
                                    <option value="MacOS">MacOS</option>
                                    <option value="Linux">Linux</option>
                                </Select>
                            </FormControl>
                        </SimpleGrid>

                        <FormControl mb={4}>
                            <FormLabel>Task Name</FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder='Enter Task Name'
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                required
                            />
                        </FormControl>
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl mb={4}>
                                <FormLabel>Due Date</FormLabel>
                                <Input
                                    value={dueDate}
                                    type='date'
                                    onChange={(e) => setDueDate(e.target.value || '')} 
                                />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Assigned To</FormLabel>
                                <UserDropdown
                                    selectedUser={assignedTo}
                                    onUserSelect={handleUserSelect}
                                />
                            </FormControl>
                        </SimpleGrid>

                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl mb={4}>
                                <FormLabel>Tags</FormLabel>
                                <TagDropdown
                                    selectedTags={selectedTags}
                                    onTagSelect={handleTagSelect}
                                    taskId={null}
                                    allTags={tags}
                                />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="On Hold">On Hold</option>
                                </Select>
                            </FormControl>
                        </SimpleGrid>

                        <Box display="flex" justifyContent="flex-end" mt={4}>
                            <Button leftIcon={<IoIosSave size={22} />} fontSize={20} width={150} type="submit" colorScheme="blue" ml={3}>
                                Save
                            </Button>
                            <Button leftIcon={<IoMdCloseCircleOutline size={22} />} fontSize={20} width={150} ml={2} onClick={() => {
                                resetForm();
                                onClose();
                            }}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default AddTaskModal;
