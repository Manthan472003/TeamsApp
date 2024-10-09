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
import { getTags } from '../Services/TagService';
import { getSections } from '../Services/SectionService';
import { Search2Icon } from '@chakra-ui/icons';

function SearchBar({ onApplyFilter, onSectionSelected, onTaskSelected, tasks, placeholder = "Search Tasks or Sections" }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [allTags, setAllTags] = useState([]); // Store all tags fetched from backend

    // Fetch suggestions (tasks and sections) when the query changes
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const [tagsRes, sectionsRes] = await Promise.all([
                    getTags(),
                    getSections(),
                ]);

                setAllTags(tagsRes.data); // Save all tags for later use

                const allSuggestions = [
                    ...tasks.map(task => ({
                        id: task.id,
                        name: task.taskName,
                        type: 'task',
                        fullData: task,
                    })),
                    ...sectionsRes.data.map(section => ({
                        id: section.id,
                        name: section.sectionName,
                        type: 'section',
                    })),
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
    }, [query, tasks]); // Update dependency array to include tasks

    // Handle selection of items (tasks or sections)
    const handleSelect = (item) => {
        if (!selectedItems.some(selected => selected.id === item.id)) {
            setSelectedItems(prev => [...prev, item]);
        }
        setQuery('');
        setSuggestions([]);

        // If a section is selected, pass the section to TaskManager via onSectionSelected
        if (item.type === 'section') {
            onSectionSelected(item); // Trigger the callback with the selected section
        }

        // If a task is selected, trigger the onTaskSelected callback
        if (item.type === 'task') {
            const selectedTaskData = item.fullData || item;
            const taskRelatedTags = allTags.filter(tag => selectedTaskData.tagIDs.includes(tag.id));
            onTaskSelected(selectedTaskData, taskRelatedTags); // Trigger the callback with the selected task and its tags
        }
    };

    const handleApply = () => {
        onApplyFilter(selectedItems);
    };

    const getTagColor = (type) => {
        switch (type) {
            case 'task':
                return 'teal';
            case 'section':
                return 'blue';
            default:
                return 'gray';
        }
    };

    return (
        <Flex alignContent="end" justifyContent="flex-end" mb={5}>
            <FormControl w="500">
                <HStack spacing={0}>
                    <AutoComplete openOnFocus>
                        <AutoCompleteInput
                            width={400}
                            placeholder={placeholder} 
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
            </FormControl>
        </Flex>
    );
}

export default SearchBar;
