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
  Table,
  Tbody,
  Tr,
  Td,
  Textarea,
  Input,
  Button,
  Tag,
  TagLabel,
  Icon,
  useToast,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { FaPaperclip } from 'react-icons/fa';
import { saveMedia, getMedias } from '../Services/MediaService';

const ViewTaskDrawer = ({ isOpen, onClose, task, users, tags, onUpdate }) => {
  const [size] = useState('xl');
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
          <DrawerHeader fontSize="2xl">TASK DETAILS</DrawerHeader>
          <DrawerBody>
            <Text fontSize="lg">No task selected.</Text>
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

  const buttonStyles = {
    base: {
      fontSize: '23px',
      fontWeight: 'bold',
      color: '#ffffff',  // Text color set to white
      backgroundImage: "linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)",
      padding: '8px 6px',
      borderRadius: '0 0 30px 0',
      transition: 'all 0.3s ease',
      marginBottom: '2px',
      width: '100%',
      textAlign: 'left',
      justifyContent: 'start',
      paddingLeft: '20px', // Add left padding here

    },
  };

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader
          sx={buttonStyles.base}
        >
          TASK DETAILS
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            <Table variant="simple">
              <Tbody>
                {/* Task Name */}
                <Tr>
                  <Td fontWeight="bold">Task Name :</Td>
                  <Td>{task.taskName || 'Unknown'}</Td>
                </Tr>
                <Divider />

                {/* Due Date */}
                <Tr>
                  <Td fontWeight="bold">Due Date :</Td>
                  <Td>{formatDate(task.dueDate) || 'Unknown'}</Td>
                </Tr>
                <Divider />

                {/* Assigned To */}
                <Tr>
                  <Td fontWeight="bold">Assigned To :</Td>
                  <Td>{getUserNameById(task.taskAssignedToID) || 'Unknown'}</Td>
                </Tr>
                <Divider />

                {/* Status */}
                <Tr>
                  <Td fontWeight="bold">Status :</Td>
                  <Td>{task.status || 'Unknown'}</Td>
                </Tr>
                <Divider />

                {/* Tags */}
                <Tr>
                  <Td fontWeight="bold">Tags :</Td>
                  <Td>
                    <HStack spacing={1} align="start">
                      {getTagNamesByIds(task.tagIDs || []).map((tagName, idx) => (
                        <Tag
                          size='md'
                          key={idx}
                          borderRadius='6px'
                          variant='solid'
                          colorScheme='green'
                        >
                          <TagLabel>{tagName}</TagLabel>
                        </Tag>
                      ))}
                    </HStack>
                  </Td>
                </Tr>
                <Divider />
              </Tbody>
            </Table>

            {/* Description Textarea */}
            <Text fontSize="lg">
              <strong>Description:</strong>
            </Text>
            <Textarea
              placeholder="Enter task description"
              value={task.description || ''}
              onChange={(e) => onUpdate({ ...task, description: e.target.value })}
              size="md"
              fontSize="md"
              resize="none"
            />

            {/* Media Upload Section */}
            <Text fontSize="lg">
              <strong>Upload Media Files:</strong>
            </Text>
            <Input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              leftIcon={<Icon as={FaPaperclip} />}
              fontSize="md"
            />
            <Button
              colorScheme="teal"
              size="lg"
              onClick={updateMedia}
              mt={4}
              fontSize="md"
            >
              Update Media
            </Button>

            <Text fontSize="lg">
              <strong>Uploaded Files:</strong>
            </Text>
            {mediaFiles.length > 0 && mediaFiles.map((file, index) => (
              <Text key={index} fontSize="md">{file.name}</Text>
            ))}
            <Divider />

            {/* Display Fetched Media */}
            <Text fontSize="lg">
              <strong>Fetched Media:</strong>
            </Text>
            {uploadedMedia.length > 0 ? (
              uploadedMedia.map((media, index) => (
                <Text key={index} fontSize="md">{media.mediaLink}</Text>
              ))
            ) : (
              <Text fontSize="md">No media found.</Text>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewTaskDrawer;
