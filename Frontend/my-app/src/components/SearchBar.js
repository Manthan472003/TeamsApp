// SearchBar.jsx
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

function SearchBar({ onApplyFilter }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    // State for ViewTaskDrawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [users, setUsers] = useState([]);

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

    const handleSelect = (item) => {
        if (!selectedItems.some(selected => selected.id === item.id)) {
            setSelectedItems(prev => [...prev, item]);
        }
        setQuery('');
        setSuggestions([]);

        // If the selected item is a task, open the ViewTaskDrawer
        if (item.type === 'task') {
            setSelectedTask(item.fullData || item); // Ensure you have the full task data
            setIsDrawerOpen(true);
        }
    };

    const handleApply = () => {
        onApplyFilter(selectedItems);
    };

    const handleRemoveItem = (itemId) => {
        setSelectedItems(prev => prev.filter(item => item.id !== itemId));
    };

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
    };

    const handleTaskUpdate = (updatedTask) => {
        // Optionally update the selected task in selectedItems
        setSelectedItems(prev => prev.map(item => item.id === updatedTask.id ? { ...item, ...updatedTask } : item));
    };

    return (
        <>
            <Flex mb={3} w="full">
                <FormControl w="500">
                    <HStack>
                        <AutoComplete openOnFocus>
                            <AutoCompleteInput
                                width={400}
                                placeholder="Search Tasks, Tags or Sections"
                                variant="filled"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <AutoCompleteList>
                                {suggestions.map(item => (
                                    <AutoCompleteItem
                                        key={`${item.type}-${item.id}`}
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
                            p="0 20"
                            onClick={handleApply}
                            disabled={selectedItems.length === 0}
                            colorScheme='teal'
                            textColor='Orange.500'
                            border={2}
                            variant='outline'
                            sx={{ borderStyle: 'dotted' }}
                        >
                            Apply Filter
                        </Button>
                    </HStack>

                    <Box mt={2}>
                        {selectedItems.map(item => (
                            <HStack key={`${item.type}-${item.id}`} spacing={2} mb={2} alignItems="center">
                                <Box>{item.name}</Box>
                                <Tag colorScheme={getTagColor(item.type)}>
                                    <TagLabel>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</TagLabel>
                                </Tag>
                                <Button size="xs" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                            </HStack>
                        ))}
                    </Box>
                </FormControl>
            </Flex>

            {/* Integrate ViewTaskDrawer */}
            <ViewTaskDrawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                task={selectedTask}
                users={users}
                tags={suggestions.filter(item => item.type === 'tag').map(tag => ({ id: tag.id, tagName: tag.name }))}
                onUpdate={handleTaskUpdate}
            />
        </>
    );
}

export default SearchBar;
