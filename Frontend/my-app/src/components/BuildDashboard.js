import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDisclosure, Box, Text, Heading, HStack, Card, CardHeader, CardBody, Stack, Spacer, useToast, Button } from '@chakra-ui/react';
import { getSections } from '../Services/SectionService';
import { createBuildEntry, fetchAllBuildEntries } from '../Services/BuildService';
import { getUsers } from '../Services/UserService';
import BuildDashboardTable from './BuildDashboardTable';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import AddBuildModal from './AddBuildModal';
import { IoMdAddCircleOutline } from "react-icons/io";

const BuildDashboard = () => {
    const { onOpen: onEditTaskOpen } = useDisclosure();
    const { onOpen: onViewTaskOpen } = useDisclosure();
    const [sections, setSections] = useState([]);
    const [tasksBySection,] = useState({});
    const [users, setUsers] = useState([]);
    const [, setTaskToEdit] = useState(null);
    const [, setCurrentUserId] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]); 
    const [filteredTasks, setFilteredTasks] = useState([]);
    const toast = useToast();
    const { isOpen: isAddTaskOpen, onOpen: onAddTaskOpen, onClose: onAddTaskClose } = useDisclosure();
    const applyFilter = (filterItems) => {
        setFilteredItems(filterItems);
    };

    const doesTaskMatchFilter = (task) => {
        if (!filteredItems.length) return true;
        return filteredItems.some(item =>
            (item.type === 'task' && item.id === task.id) ||
            (item.type === 'section' && task.sectionID === item.id)
        );
    };

    useEffect(() => {
        const filteredTasks = tasks.filter(task => task.status !== 'Completed' && !task.isDelete && task.sentToQA);
        setFilteredTasks(filteredTasks);
    }, [tasks]);

    const handleSectionSelected = (section) => {
        setSelectedSection(section);
    };

    const handleTaskSelected = (task) => {
        setSelectedTask(task);
        onViewTaskOpen();
    };

    const filteredSections = useMemo(() => {
        if (selectedSection) {
            return sections.filter(section => section.id === selectedSection.id);
        }
        return sections;
    }, [sections, selectedSection]);

    const fetchSections = useCallback(async () => {
        try {
            const response = await getSections();
            if (response && response.data) {
                setSections(response.data);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Fetch Sections Error:', error);
            toast({
                title: "Error fetching sections.",
                description: "Unable to fetch sections. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await getUsers();
            if (response && response.data) {
                setUsers(response.data);
                setCurrentUserId(response.data[0]?.id);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Fetch Users Error:', error);
            toast({
                title: "Error fetching users.",
                description: "Unable to fetch users. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]);

    const handleEdit = (task) => {
        setTaskToEdit(task);
        onEditTaskOpen();
    };

    useEffect(() => {
        fetchSections();
        fetchUsers();
        fetchAllBuildEntries();
    }, [fetchSections, fetchUsers,]);

    const handleEntrySubmit = async (data) => {
        try {
            await createBuildEntry(data); // Ensure createBuildEntry is correctly imported
            const response = await fetchAllBuildEntries(); // Refresh the tasks after adding a new entry
            onAddTaskClose(); 
            setTasks(response.data);
            onAddTaskClose();
            toast({
                title: "Build Entry Created",
                description: "The build entry has been successfully created.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error adding entry:', error);
            toast({
                title: "Error creating build entry.",
                description: "There was a problem creating the build entry. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box mt={5}>
            <Sidebar
                onSectionAdded={fetchSections}
            />
            <Heading as='h2' size='xl' paddingLeft={3}
                sx={{
                    background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                }}>
                Build Dashboard
            </Heading>
            <br />

            <Button
                leftIcon={<IoMdAddCircleOutline size={23} />}
                onClick={onAddTaskOpen}
                colorScheme='blue' variant='outline' mt={3} mb={4}>
                Add Builds
            </Button>
            <AddBuildModal
                isOpen={isAddTaskOpen}
                onClose={onAddTaskClose}
                onSubmit={handleEntrySubmit}
            />

            <SearchBar
                onSectionSelected={handleSectionSelected}
                onTaskSelected={handleTaskSelected}
                onApplyFilter={applyFilter}
                tasks={filteredTasks}
            />

            <Stack spacing={4}>
                {filteredSections.map(section => {
                    const tasksToShow = tasksBySection[section.id]?.filter(doesTaskMatchFilter) || [];
                    return (
                        <Card key={section.id} variant="outline" borderWidth={1} borderRadius="md">
                            <CardHeader>
                                <HStack spacing={2}>
                                    <Text fontSize='xl' fontWeight='bold' color='#149edf'>{section.sectionName}</Text>
                                    <Spacer />
                                </HStack>
                            </CardHeader>
                            <CardBody>
                                <Box display="flex" alignItems="center" mb={3} justifyContent="flex-end">
                                    <HStack spacing={2}>
                                        <div style={{ backgroundColor: '#CDF5FD', padding: '6px', width: '30px' }}></div>
                                        <span>Not Started</span>
                                        <div style={{ backgroundColor: '#A0E9FF', padding: '6px', width: '30px' }}></div>
                                        <span>In Progress</span>
                                        <div style={{ backgroundColor: '#89CFF3', padding: '6px', width: '30px' }}></div>
                                        <span>On Hold</span>
                                    </HStack>
                                </Box>
                                <BuildDashboardTable
                                    tasks={tasksToShow}
                                    onEdit={handleEdit}
                                    users={users}
                                />
                            </CardBody>
                        </Card>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default BuildDashboard;