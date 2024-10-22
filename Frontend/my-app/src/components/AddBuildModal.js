import React, { useEffect, useState } from 'react';
import { getSections } from '../Services/SectionService';
import { getTasksBySection, saveTask } from '../Services/TaskService';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Button,
    Flex,
    Select,
    FormErrorMessage,
    List,
    HStack,
    ListItem,
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';

const AddBuildModal = ({ isOpen, onClose, onSubmit, taskToEdit }) => {
    const [appId, setAppId] = useState('');
    const [deployedOn, setDeployedOn] = useState('');
    const [versionName, setVersionName] = useState('');
    const [mediaLink, setMediaLink] = useState('');
    const [sections, setSections] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);
    const [errors, setErrors] = useState({});
    const [customTask, setCustomTask] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await getSections();
                setSections(response.data || []);
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        };
        fetchSections();
    }, []);

    useEffect(() => {
        const fetchTasks = async (sectionId) => {
            try {
                const response = await getTasksBySection(sectionId);
                setFilteredTasks(response.data || []);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        if (appId) {
            fetchTasks(appId);
        } else {
            setFilteredTasks([]);
        }
    }, [appId]);

    useEffect(() => {
        if (taskToEdit) {
            setAppId(taskToEdit.appId || '');
            setDeployedOn(taskToEdit.deployedOn || '');
            setVersionName(taskToEdit.versionName || '');
            setMediaLink(taskToEdit.mediaLink || '');
            setSelectedTaskIds(taskToEdit.selectedTasks || []);
        } else {
            resetFields();
        }
    }, [taskToEdit]);

    useEffect(() => {
        if (!isOpen) {
            resetFields(); // Reset fields when modal closes
        }
    }, [isOpen]);

    const resetFields = () => {
        setAppId('');
        setDeployedOn('');
        setVersionName('');
        setMediaLink('');
        setSelectedTaskIds([]);
        setFilteredTasks([]);
        setErrors({});
        setCustomTask('');
        setError('');
    };

    const validateFields = () => {
        const newErrors = {};
        if (!appId) newErrors.appId = "Application is required.";
        if (!deployedOn) newErrors.deployedOn = "Deployed On is required.";
        if (!versionName) newErrors.versionName = "Version Name is required.";
        if (selectedTaskIds.length === 0) newErrors.selectedTasks = "At least one task must be selected.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddTask = (taskId) => {
        const taskName = getTaskNameById(taskId); // Get the task name based on the ID
        if (taskName && !selectedTaskIds.includes(taskName)) {
            setSelectedTaskIds((prev) => [...prev, taskName]); // Store task name directly
        }
    };

    const handleRemoveTask = (taskName) => {
        setSelectedTaskIds((prev) => prev.filter(name => name !== taskName)); // Remove by task name
    };

    const getTaskNameById = (taskId) => {
        const task = filteredTasks.find(task => task.id === Number(taskId));
        return task ? task.taskName : null; // Return null if not found
    };

    const handleSubmit = () => {
        if (validateFields()) {
            const newBuild = {
                appId,
                deployedOn,
                versionName,
                mediaLink,
                tasksForBuild: selectedTaskIds,
            };
            onSubmit(newBuild);
            onClose();
        }
    };

    const handlesaveTask = async () => {
        if (!customTask) {
            setError("Custom task name is required.");
            return;
        }

        try {
            await saveTask({ taskName: customTask, appId });
            setSelectedTaskIds((prev) => [...prev, customTask]);
            setCustomTask('');
            setError('');
        } catch (error) {
            console.error('Error adding custom task:', error);
            setError("Failed to add custom task.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{taskToEdit ? "Edit Build" : "Add Build"}</ModalHeader>
                <ModalBody style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <FormControl mb={4} isInvalid={!!errors.appId}>
                        <FormLabel>Application</FormLabel>
                        <Select value={appId} onChange={(e) => setAppId(e.target.value)}>
                            <option value="">Select Application</option>
                            {sections.map(section => (
                                <option key={section.id} value={section.id}>
                                    {section.sectionName}
                                </option>
                            ))}
                        </Select>
                        <FormErrorMessage>{errors.appId}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!errors.deployedOn}>
                        <FormLabel>Deployed On</FormLabel>
                        <Select value={deployedOn} onChange={(e) => setDeployedOn(e.target.value)}>
                            <option value="">Select Environment</option>
                            <option value="Production">Production</option>
                            <option value="Stage">Stage</option>
                        </Select>
                        <FormErrorMessage>{errors.deployedOn}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!errors.versionName}>
                        <FormLabel>Version Name</FormLabel>
                        <Input value={versionName} onChange={(e) => setVersionName(e.target.value)} />
                        <FormErrorMessage>{errors.versionName}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Media Link</FormLabel>
                        <Input value={mediaLink} onChange={(e) => setMediaLink(e.target.value)} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Tasks</FormLabel>
                        <Popover>
                            <PopoverTrigger>
                                <Button leftIcon={<AddIcon/>} width={445} colorScheme="blue">Add Task Covered In Build</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverHeader>Add Tasks</PopoverHeader>
                                <PopoverBody>
                                    <Select placeholder="Select Task" onChange={(e) => handleAddTask(e.target.value)}>
                                        {filteredTasks.map(task => (
                                            <option key={task.id} value={task.id} disabled={selectedTaskIds.includes(task.id)}>
                                                {task.taskName}
                                            </option>
                                        ))}
                                    </Select>
                                    <FormControl mt={4} isInvalid={!!error}>
                                        <FormLabel>Add Custom Task</FormLabel>
                                        <HStack>
                                            <Input
                                                value={customTask}
                                                onChange={(e) => setCustomTask(e.target.value)}
                                                placeholder="Enter custom task name"
                                            />
                                            <Button colorScheme="blue" onClick={handlesaveTask}>
                                                Add Task
                                            </Button>
                                            <FormErrorMessage>{error}</FormErrorMessage>
                                        </HStack>
                                    </FormControl>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </FormControl>

                    <List spacing={3} mt={4}>
                        <Flex>
                            {selectedTaskIds.map(taskName => (
                                <ListItem key={taskName} display="flex" alignItems="center" mr={3}>
                                    {taskName}
                                    <IconButton
                                        aria-label="Remove task"
                                        icon={<CloseIcon />}
                                        ml={2}
                                        size="sm"
                                        onClick={() => handleRemoveTask(taskName)}
                                    />
                                </ListItem>
                            ))}
                        </Flex>
                    </List>
                    <FormErrorMessage>{errors.selectedTasks}</FormErrorMessage>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddBuildModal;