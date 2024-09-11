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
    Stack,
    Text,
    Flex,
    useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { getTags, saveTag } from '../Services/TagService';

const TagDropdown = ({ selectedTags, onTagSelect }) => {
    const [tags, setTags] = useState([]);
    const [customTag, setCustomTag] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState(new Set());
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTags();
                console.log('Fetched tags:', response.data); // Debugging line
                setTags(response.data.map(tag => ({ id: tag.id, name: tag.tagName }))); // Adjust according to your backend response
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
        // Initialize selectedTagIds from selectedTags
        setSelectedTagIds(new Set(selectedTags));
    }, [selectedTags]);

// Inside TagDropdown component
const handleTagSelect = (tag) => {
    const newSelectedTagIds = new Set(selectedTagIds);
    if (newSelectedTagIds.has(tag.id)) {
        newSelectedTagIds.delete(tag.id);
    } else {
        newSelectedTagIds.add(tag.id);
    }
    const filteredTags = Array.from(newSelectedTagIds).filter(id => id != null); // Remove undefined values
    console.log('Updated selected tags in TagDropdown:', filteredTags); // Debugging line
    setSelectedTagIds(new Set(filteredTags));
    onTagSelect(filteredTags); // This should pass the correct tag IDs
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
                const newTagId = response.data.id; // Adjust according to your backend response
                setTags([...tags, { id: newTagId, name: customTag }]);
                const updatedSelectedTags = Array.from(selectedTagIds).concat(newTagId);
                setSelectedTagIds(new Set(updatedSelectedTags));
                onTagSelect(updatedSelectedTags);
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

    return (
        <Box width="400px" p={4}>
            <Stack spacing={3}>
                <Box>
                    <Flex wrap="wrap" gap={2}>
                        {Array.from(selectedTagIds).map(tagId => (
                            <Text
                                key={tagId} // Ensure each selected tag has a unique key
                                bg="teal.100"
                                p={2}
                                borderRadius="md"
                                textAlign="center"
                            >
                                {tags.find(tag => tag.id === tagId)?.name || tagId}
                            </Text>
                        ))}
                    </Flex>
                </Box>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Select Tags
                    </MenuButton>
                    <MenuList>
                        {tags.length > 0 ? (
                            tags.map(tag => (
                                <MenuItem key={tag.id}> {/* Ensure each MenuItem has a unique key */}
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
                <Box>
                    <Flex align="center">
                        <Input
                            value={customTag}
                            onChange={(e) => setCustomTag(e.target.value)}
                            placeholder="Add custom tag"
                            mr={2}
                        />
                        <Button
                            onClick={handleAddCustomTag}
                            colorScheme="teal"
                            width="300px"
                        >
                            Add Custom Tag
                        </Button>
                    </Flex>
                </Box>
            </Stack>
        </Box>
    );
};

export default TagDropdown;

