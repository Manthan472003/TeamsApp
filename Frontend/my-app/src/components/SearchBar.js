import React, { useState, useEffect } from 'react';
import {
    Input,
    Button,
    VStack,
    Box,
    Heading,
    List,
    ListItem,
    ListIcon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/react';
import { getTasks } from '../Services/TaskService';
import { getTags } from '../Services/TagService';
import { getSections } from '../Services/SectionService';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState({
        tasks: [],
        tags: [],
        sections: [],
    });
    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 3) {
                setSuggestions({ tasks: [], tags: [], sections: [] });
                return;
            }

            try {
                const [tasksRes, tagsRes, sectionsRes] = await Promise.all([
                    getTasks(),
                    getTags(),
                    getSections(),
                ]);

                const filteredTasks = tasksRes.data.filter(task =>
                    task.taskName.toLowerCase().includes(query.toLowerCase())
                );

                const filteredTags = tagsRes.data.filter(tag =>
                    tag.tagName.toLowerCase().includes(query.toLowerCase())
                );

                const filteredSections = sectionsRes.data.filter(section =>
                    section.sectionName.toLowerCase().includes(query.toLowerCase())
                );

                setSuggestions({
                    tasks: filteredTasks,
                    tags: filteredTags,
                    sections: filteredSections,
                });
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
        setQuery(''); // Clear the input after selection
        setSuggestions({ tasks: [], tags: [], sections: [] }); // Clear suggestions
    };

    const handleApply = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <VStack spacing={4} align="stretch">
            <Popover>
                <PopoverTrigger>
                    <Input
                        placeholder="Search tasks, tags, sections..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <Box p={4}>
                        {suggestions.tasks.length > 0 && <Heading size="md">Tasks:</Heading>}
                        <List spacing={2}>
                            {suggestions.tasks.map(task => (
                                <ListItem key={task.id} onClick={() => handleSelect(task)} cursor="pointer">
                                    <ListIcon color="green.500" />
                                    {task.taskName}
                                </ListItem>
                            ))}
                        </List>

                        {suggestions.tags.length > 0 && <Heading size="md">Tags:</Heading>}
                        <List spacing={2}>
                            {suggestions.tags.map(tag => (
                                <ListItem key={tag.id} onClick={() => handleSelect(tag)} cursor="pointer">
                                    <ListIcon color="blue.500" />
                                    {tag.tagName}
                                </ListItem>
                            ))}
                        </List>

                        {suggestions.sections.length > 0 && <Heading size="md">Sections:</Heading>}
                        <List spacing={2}>
                            {suggestions.sections.map(section => (
                                <ListItem key={section.id} onClick={() => handleSelect(section)} cursor="pointer">
                                    <ListIcon color="orange.500" />
                                    {section.sectionName}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </PopoverContent>
            </Popover>

            <Button colorScheme="teal" onClick={handleApply} disabled={selectedItems.length === 0}>
                Apply Filter
            </Button>

            {/* Modal to show the filtered results */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Selected Items</ModalHeader>
                    <ModalBody>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Type</Th>
                                    <Th>Name</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {selectedItems.map(item => (
                                    <Tr key={item.id}>
                                        <Td>{item.id}</Td>
                                        <Td>{item.taskName ? 'Task' : item.tagName ? 'Tag' : 'Section'}</Td>
                                        <Td>{item.taskName || item.tagName || item.sectionName}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default SearchBar;
