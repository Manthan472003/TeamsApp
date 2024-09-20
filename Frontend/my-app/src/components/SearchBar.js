import React, { useState, useEffect } from 'react';
import {
    Flex,
    FormControl,
    FormLabel,
    Button,
    Box,
    HStack,
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

function SearchBar({ onApplyFilter }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 3) {
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
                    ...tasksRes.data.map(task => ({ id: task.id, name: task.taskName, type: 'task' })),
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
    };

    const handleApply = () => {
        onApplyFilter(selectedItems);
    };

    const handleRemoveItem = (itemId) => {
        setSelectedItems(prev => prev.filter(item => item.id !== itemId));
    };

    return (
        <Flex mb={3} w="full">
            <FormControl w="500">
                <FormLabel mb={1}>Search...</FormLabel>
                <HStack>
                    <AutoComplete openOnFocus>
                        <AutoCompleteInput
                            placeholder="Search Tasks, Tags or Sections"
                            variant="filled"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <AutoCompleteList>
                            {suggestions.map(item => (
                                <AutoCompleteItem
                                    key={item.id}
                                    value={item.name}
                                    textTransform="capitalize"
                                    onClick={() => handleSelect(item)}
                                >
                                    {item.name}
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
                        <HStack key={item.id} spacing={2} mb={2}>
                            <Box>{item.name}</Box>
                            <Button size="xs" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                        </HStack>
                    ))}
                </Box>
            </FormControl>
        </Flex>
    );
}

export default SearchBar;