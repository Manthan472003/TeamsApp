import React, { useState } from 'react';
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
  Text,
  Toast
} from '@chakra-ui/react';
import { FaPaperclip } from 'react-icons/fa'; 
import { saveMedia } from '../Services/MediaService';

const ViewTaskDrawer = ({ isOpen, onClose, task, users = [], tags = [], onUpdate }) => {
  const [size] = useState('lg');
  const [subTasks, setSubTasks] = useState(['']); // State for sub-tasks
  const [mediaFiles, setMediaFiles] = useState([]); // State for media files
  const [uploading, setUploading] = useState(false);

  if (!task) {
    return null; // If no task, do not render anything
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
    setSubTasks([...subTasks, '']); // Add a new empty sub-task
  };

  const handleFileChange = (event) => {
    setMediaFiles([...mediaFiles, ...Array.from(event.target.files)]);
  };

  const uploadMediaFiles = async () => {
    setUploading(true);
    const formData = new FormData();
    mediaFiles.forEach(file => {
      formData.append('mediaFile', file);
    });

    try {
      await saveMedia(formData);
      Toast({
        title: "Upload successful.",
        description: "Your files have been uploaded.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error uploading media:', error);
      Toast({
        title: "Upload failed.",
        description: "There was an error uploading your files.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      setMediaFiles([]); // Clear the files after upload
    }
  };
  const getTagNamesByIds = (tagIds) => {
    const tagMap = new Map(tags.map(tag => [tag.id, tag.tagName]));

    return tagIds.map(id => {
        const tagName = tagMap.get(id);
        if (!tagName) {
            console.error(`No tag found for ID: ${id}`);
            return 'Unknown';
        }
        return tagName;
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
              <VStack spacing={1} align="start">
                {getTagNamesByIds(task.tagIDs || []).map((tagName, idx) => (
                  <Tag key={idx} size='md' borderRadius='6px' variant='solid' colorScheme='green'>
                    <TagLabel>{tagName}</TagLabel>
                  </Tag>
                ))}
              </VStack>
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
                rows={1} // Set rows to 1 for a single line
                style={{ overflow: 'hidden', resize: 'none' }} // Prevent resizing
              />
            ))}
            <Box textAlign="left">
              <Button colorScheme="teal" size="sm" onClick={handleAddSubTask}>
                Add many Sub-Tasks
              </Button>
            </Box>

            {/* Media Upload Section */}
            <Text><strong>Media Upload:</strong></Text>
            <Input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              leftIcon={<Icon as={FaPaperclip} />}
            />
            <Button 
              colorScheme="teal" 
              size="sm" 
              isLoading={uploading} 
              onClick={uploadMediaFiles}
            >
              Upload Media
            </Button>

            <Text><strong>Uploaded Files:</strong></Text>
            {mediaFiles.length > 0 && mediaFiles.map((file, index) => (
              <Text key={index}>{file.name}</Text>
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewTaskDrawer;
