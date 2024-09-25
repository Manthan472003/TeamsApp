import React, { useState, useEffect } from 'react';
import {
    Box,
    Checkbox,
    Input,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    VStack,
    Tag, TagLabel, TagCloseButton,
    Flex,
    useToast,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { getTags, saveTag, removeTagFromTask } from '../Services/TagService';

const TagDropdown = ({ selectedTags, onTagSelect, taskId }) => {
    const [tags, setTags] = useState([]);
    const [customTag, setCustomTag] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState(new Set());
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTags();
                console.log('Fetched tags:', response.data);
                setTags(response.data.map(tag => ({ id: tag.id, name: tag.tagName })));
            } catch (error) {
                console.error('Error fetching tags:', error);
                toast({
                    title: "Error Fetching Tags",
                    description: "There was an error fetching the tags. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
        fetchData();
    }, [toast]);

    useEffect(() => {
        setSelectedTagIds(new Set(selectedTags));
    }, [selectedTags]);

    const handleTagSelect = (tag) => {
        const newSelectedTagIds = new Set(selectedTagIds);
        if (newSelectedTagIds.has(tag.id)) {
            newSelectedTagIds.delete(tag.id);
        } else {
            newSelectedTagIds.add(tag.id);
        }
        const filteredTags = Array.from(newSelectedTagIds).filter(id => id != null);
        console.log('Updated selected tags in TagDropdown:', filteredTags);
        setSelectedTagIds(new Set(filteredTags));
        onTagSelect(filteredTags);
    };

    const handleAddCustomTag = async () => {
        if (customTag.trim() === '') {
            toast({
                title: "Invalid Tag",
                description: "Please enter a valid tag.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (tags.some(tag => tag.name === customTag)) {
            toast({
                title: "Tag Already Exists",
                description: "This tag already exists. Please choose a different tag.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const newTag = { tagName: customTag };

        try {
            const response = await saveTag(newTag);
            if (response.status === 201) {
                await fetchTags();
                setCustomTag('');
                toast({
                    title: "Tag Added",
                    description: "Your custom tag has been added successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error Adding Tag",
                    description: "There was an issue adding the tag. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error saving tag:', error);
            toast({
                title: "Error",
                description: "There was an error connecting to the server. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const fetchTags = async () => {
        try {
            const response = await getTags();
            console.log('Fetched tags:', response.data);
            setTags(response.data.map(tag => ({ id: tag.id, name: tag.tagName })));
        } catch (error) {
            console.error('Error fetching tags:', error);
            toast({
                title: "Error Fetching Tags",
                description: "There was an error fetching the tags. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleTagRemove = async (tagId) => {
        // Call the removeTagFromTask service here
        console.log("TagID : ", tagId);
        console.log("TaskID : ", taskId);
        try {
            await removeTagFromTask(tagId, taskId);
            setSelectedTagIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(tagId);
                return newSet;
            });
            toast({
                title: "Tag Removed",
                description: "The tag has been successfully removed from the task.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error removing tag:', error);
            toast({
                title: "Error Removing Tag",
                description: "There was an error removing the tag. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box width="100%" p={4}>
            <HStack spacing={3} align="center">
                <Flex wrap="wrap" gap={2}>
                    {Array.from(selectedTagIds).map(tagId => {
                        const tag = tags.find(tag => tag.id === tagId);
                        return (
                            <Tag
                                key={tagId}
                                size="md"
                                borderRadius="md"
                                variant="solid"
                                colorScheme="teal"
                                mr={2}
                                mb={2}
                            >
                                <TagLabel>{tag ? tag.name : tagId}</TagLabel>
                                <TagCloseButton onClick={() => handleTagRemove(tagId)} />
                            </Tag>
                        );
                    })}
                </Flex>

                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Select Tags
                    </MenuButton>
                    <MenuList>
                        {tags.length > 0 ? (
                            tags.map(tag => (
                                <MenuItem key={tag.id}>
                                    <Checkbox
                                        isChecked={selectedTagIds.has(tag.id)}
                                        onChange={() => handleTagSelect(tag)}
                                    >
                                        {tag.name}
                                    </Checkbox>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem>No tags available</MenuItem>
                        )}
                    </MenuList>
                </Menu>
            </HStack>

            <VStack spacing={2} mt={4} align="stretch">
                <Flex align="center">
                    <Input
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        placeholder="Add custom tag"
                        mr={2}
                    />
                    <Button
                        width={300}
                        onClick={handleAddCustomTag}
                        colorScheme="teal"
                        leftIcon={<AddIcon />}
                    >
                        Add Custom Tag
                    </Button>
                </Flex>
            </VStack>
        </Box>
    );
};

export default TagDropdown;
