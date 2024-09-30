import React, { useState, useEffect } from 'react';
import {
    Flex,
    FormControl,
    Button,
    Box,
    HStack,
    Tag,
    TagLabel,
} from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { getTasks } from '../Services/TaskService';
import { getTags } from '../Services/TagService';
import { getSections } from '../Services/SectionService';
import ViewTaskDrawer from './ViewTaskDrawer'; // Import the ViewTaskDrawer component
import { getUsers } from '../Services/UserService'; // Import a service to fetch users
// import { FaSearch } from "react-icons/fa";
import { Search2Icon } from '@chakra-ui/icons';


function SearchBar({ onApplyFilter, onSectionSelected }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    // State for ViewTaskDrawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [users, setUsers] = useState([]);
    const [allTags, setAllTags] = useState([]); // Store all tags fetched from backend
    const [taskTags, setTaskTags] = useState([]); // Tags specific to the selected task

    // Fetch users for the task drawer
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRes = await getUsers();
                setUsers(usersRes.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Fetch suggestions (tasks, tags, and sections) when the query changes
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const [tasksRes, tagsRes, sectionsRes] = await Promise.all([
                    getTasks(),
                    getTags(),
                    getSections(),
                ]);

                setAllTags(tagsRes.data); // Save all tags for later use

                const allSuggestions = [
                    ...tasksRes.data.map(task => ({ id: task.id, name: task.taskName, type: 'task', fullData: task })),
                    ...tagsRes.data.map(tag => ({ id: tag.id, name: tag.tagName, type: 'tag' })),
                    ...sectionsRes.data.map(section => ({ id: section.id, name: section.sectionName, type: 'section' })),
                ];

                const filteredSuggestions = allSuggestions.filter(item =>
                    item.name.toLowerCase().includes(query.toLowerCase())
                );

                setSuggestions(filteredSuggestions);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        fetchSuggestions();
    }, [query]);

    // Handle selection of items (tasks, sections, or tags)
    const handleSelect = (item) => {
        if (!selectedItems.some(selected => selected.id === item.id)) {
            setSelectedItems(prev => [...prev, item]);
        }
        setQuery('');
        setSuggestions([]);

        // If a section is selected, pass the section to TaskManager via onSectionSelected
        if (item.type === 'section') {
            onSectionSelected(item);  // Trigger the callback with the selected section
        }

        // If a task is selected, open the task drawer
        if (item.type === 'task') {
            const selectedTaskData = item.fullData || item;
            setSelectedTask(selectedTaskData);

            // Extract the tags specific to the selected task
            const taskRelatedTags = allTags.filter(tag => selectedTaskData.tagIDs.includes(tag.id));
            setTaskTags(taskRelatedTags);

            setIsDrawerOpen(true);
        }
    };

    const handleApply = () => {
        onApplyFilter(selectedItems);
    };

    // const handleRemoveItem = (itemId) => {
    //     setSelectedItems(prev => prev.filter(item => item.id !== itemId));
    // };

    const getTagColor = (type) => {
        switch (type) {
            case 'task':
                return 'teal';
            case 'tag':
                return 'orange';
            case 'section':
                return 'blue';
            default:
                return 'gray';
        }
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setSelectedTask(null);
        setTaskTags([]); // Reset the task-specific tags when closing the drawer
    };

    const handleTaskUpdate = (updatedTask) => {
        // Optionally update the selected task in selectedItems
        setSelectedItems(prev => prev.map(item => item.id === updatedTask.id ? { ...item, ...updatedTask } : item));
    };

    return (
        <>
            <Flex alignContent="end" justifyContent="flex-end" mb={5}>
                <FormControl w="500">
                    <HStack spacing={0}>
                        <AutoComplete openOnFocus>
                            <AutoCompleteInput
                                width={400}
                                placeholder="Search Tasks, Tags or Sections"
                                variant="outline"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <AutoCompleteList>
                                {suggestions.map(item => (
                                    <AutoCompleteItem
                                        key={`${item.id}-${item.type}`} // Use a combination of id and type as the key
                                        value={item.name}
                                        textTransform="capitalize"
                                        onClick={() => handleSelect(item)}
                                    >
                                        <Flex justify="space-between" width="full">
                                            <Box>{item.name}</Box>
                                            <Tag size="md" colorScheme={getTagColor(item.type)}>
                                                <TagLabel>{item.type}</TagLabel>
                                            </Tag>
                                        </Flex>
                                    </AutoCompleteItem>
                                ))}
                            </AutoCompleteList>
                        </AutoComplete>

                        <Button
                            onClick={handleApply}
                            disabled={selectedItems.length === 0}
                            textColor='Orange.500'
                            variant="outline"
                            leftIcon={<Search2Icon />}

                        >
                            Search
                           
                        </Button>
                    </HStack>

                    {/* <Box mt={2}>
            {selectedItems.map(item => (
                <HStack key={`${item.type}-${item.id}`} spacing={2} mb={2} alignItems="center">
                    <Box>{item.name}</Box>
                    <Tag colorScheme={getTagColor(item.type)}>
                        <TagLabel>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</TagLabel>
                    </Tag>
                    <Button size="xs" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                </HStack>
            ))}
        </Box> */}
                </FormControl>
            </Flex>


            {/* Integrate ViewTaskDrawer */}
            <ViewTaskDrawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                task={selectedTask}
                users={users}
                tags={taskTags} // Pass task-specific tags to the drawer
                onUpdate={handleTaskUpdate}
            />
        </>
    );
}

export default SearchBar;
