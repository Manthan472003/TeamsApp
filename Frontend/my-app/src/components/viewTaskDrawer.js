import React, { useState, useEffect, useCallback } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Text,
  Textarea,
  Input,
  Button,
  Tag,
  TagLabel,
  Icon,
  Box,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { FaPaperclip } from 'react-icons/fa';
import { saveMedia, getMedias } from '../Services/MediaService';

const ViewTaskDrawer = ({ isOpen, onClose, task, users = [], tags = [], onUpdate }) => {
  const [size] = useState('xl');
  const [subTasks, setSubTasks] = useState(['']);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const toast = useToast();

  const fetchMedia = useCallback(async () => {
    if (!task || !task.id) return;

    try {
      const media = await getMedias(task.id);
      setUploadedMedia(media);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: "Error fetching media.",
        description: "Could not load media files.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [task, toast]);

  useEffect(() => {
    if (isOpen && task) {
      fetchMedia();
      setMediaFiles([]); // Clear media files on drawer open
    }
  }, [fetchMedia, isOpen, task]);

  // Return early if task is not defined
  if (!task) {
    return (
      <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>TASK DETAILS</DrawerHeader>
          <DrawerBody>
            <Text>No task selected.</Text>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubTaskChange = (index, value) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index] = value;
    setSubTasks(newSubTasks);
  };

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, '']);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setMediaFiles(files);
  };

  const updateMedia = async () => {
    if (!task || !task.id) return;

    const formData = new FormData();
    mediaFiles.forEach(file => {
      formData.append('mediaFile', file);
    });
    formData.append('taskId', task.id); // Attach the task ID here

    try {
      await saveMedia(formData); // Save the media to the task
      toast({
        title: "Media Updated",
        description: "Media files have been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      await fetchMedia(); // Refetch media after upload
    } catch (error) {
      console.error('Failed to update media:', error.response ? error.response.data : error.message);
      toast({
        title: "Update Failed",
        description: "There was an error updating media files.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setMediaFiles([]); // Clear selected files
    }
  };

  const getTagNamesByIds = (tagIds) => {
    const tagMap = new Map(tags.map(tag => [tag.id, tag.tagName]));
    return tagIds.map(id => {
      const tagName = tagMap.get(id);
      return tagName || 'Unknown';
    });
  };

  const getUserNameById = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.userName : 'Unknown';
  };

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>TASK DETAILS</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            <Text><strong>Task Name:</strong> {task.taskName || 'Unknown'}</Text>
            <Text><strong>Due Date:</strong> {formatDate(task.dueDate) || 'Unknown'}</Text>
            <Text><strong>Assigned To:</strong> {getUserNameById(task.taskAssignedToID) || 'Unknown'}</Text>
            <Text><strong>Status:</strong> {task.status || 'Unknown'}</Text>
            <Text><strong>Tags:</strong>
              <HStack spacing={1} align="start">
                {getTagNamesByIds(task.tagIDs || []).map((tagName, idx) => (
                  <Tag key={idx} size='md' borderRadius='6px' variant='solid' colorScheme='green'>
                    <TagLabel>{tagName}</TagLabel>
                  </Tag>
                ))}
              </HStack>
            </Text>

            {/* Description Textarea */}
            <Text><strong>Description:</strong></Text>
            <Textarea
              placeholder="Enter task description"
              value={task.description || ''}
              onChange={(e) => onUpdate({ ...task, description: e.target.value })}
              size="sm"
            />

            {/* Sub-Tasks Section */}
            <Text><strong>Sub-Tasks:</strong></Text>
            {subTasks.map((subTask, index) => (
              <Textarea
                key={index}
                placeholder={`Sub-task`}
                value={subTask}
                onChange={(e) => handleSubTaskChange(index, e.target.value)}
                size="sm"
                mb={2}
                rows={1}
                style={{ overflow: 'hidden', resize: 'none' }}
              />
            ))}
            <Box textAlign="left">
              <Button colorScheme="teal" size="sm" onClick={handleAddSubTask}>
                Add Sub-Task
              </Button>
            </Box>

            {/* Media Upload Section */}
            <Text><strong>Upload Media Files:</strong></Text>
            <Input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              leftIcon={<Icon as={FaPaperclip} />}
            />
            <Button
              colorScheme="teal"
              onClick={updateMedia}
            >
              Update Media
            </Button>

            <Text><strong>Uploaded Files:</strong></Text>
            {mediaFiles.length > 0 && mediaFiles.map((file, index) => (
              <Text key={index}>{file.name}</Text>
            ))}

            {/* Display Fetched Media */}
            <Text><strong>Fetched Media:</strong></Text>
            {uploadedMedia.length > 0 ? (
              uploadedMedia.map((media, index) => (
                <Text key={index}>{media.mediaLink}</Text>
              ))
            ) : (
              <Text>No media found.</Text>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewTaskDrawer;
