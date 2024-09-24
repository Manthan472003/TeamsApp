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
  Tag,
  TagLabel,
  HStack,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { getMediaOfTheTask } from '../Services/MediaService';
import MediaUploader from './MediaUploader'; // Import the MediaUploader component

const ViewTaskDrawer = ({ isOpen, onClose, task, users, tags, onUpdate }) => {
  const [size] = useState('xl');
  const [, setUploadedMedia] = useState([]); // Fixed state initialization
  const toast = useToast();

  const fetchMedia = useCallback(async () => {
    if (!task || !task.id) return;

    try {
      const { data } = await getMediaOfTheTask(task.id);
      console.log('Fetched media:', data);
      setUploadedMedia(data);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: 'Error fetching media.',
        description: 'Could not load media files.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [task, toast]);

  useEffect(() => {
    if (isOpen && task) {
      fetchMedia();
    }
  }, [fetchMedia, isOpen, task]);

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
    if (!dateString) return 'Unknown';
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTagNamesByIds = (tagIds) => {
    const tagMap = new Map(tags.map((tag) => [tag.id, tag.tagName]));
    return tagIds.map((id) => tagMap.get(id) || 'Unknown');
  };

  const getUserNameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.userName : 'Unknown';
  };

  const buttonStyles = {
    base: {
      fontSize: '23px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundImage: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
      padding: '8px 6px',
      borderRadius: '0 0 30px 0',
      transition: 'all 0.3s ease',
      marginBottom: '2px',
      width: '100%',
      textAlign: 'left',
      justifyContent: 'start',
      paddingLeft: '20px',
    },
  };

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader sx={buttonStyles.base}>TASK DETAILS</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            <Table variant="simple">
              <Tbody>
                <Tr fontSize="lg">
                  <Td fontWeight="bold">Task Name :</Td>
                  <Td>{task.taskName || 'Unknown'}</Td>
                </Tr>
                <Divider />
                <Tr fontSize="lg">
                  <Td fontWeight="bold">Due Date :</Td>
                  <Td>{formatDate(task.dueDate)}</Td>
                </Tr>
                <Divider />
                <Tr fontSize="lg">
                  <Td fontWeight="bold">Assigned To :</Td>
                  <Td>{getUserNameById(task.taskAssignedToID)}</Td>
                </Tr>
                <Divider />
                <Tr fontSize="lg">
                  <Td fontWeight="bold">Status :</Td>
                  <Td>{task.status || 'Unknown'}</Td>
                </Tr>
                <Divider />
                <Tr fontSize="lg">
                  <Td fontWeight="bold">Tags :</Td>
                  <Td>
                    <HStack spacing={1} align="start">
                      {getTagNamesByIds(task.tagIDs || []).map((tagName, idx) => (
                        <Tag size="md" key={idx} borderRadius="6px" variant="solid" colorScheme="green">
                          <TagLabel>{tagName}</TagLabel>
                        </Tag>
                      ))}
                    </HStack>
                  </Td>
                </Tr>
                <Divider />
              </Tbody>
            </Table>

            <Text fontSize="lg"><strong>Description:</strong></Text>
            <Textarea
              placeholder="Enter task description"
              value={task.description || ''}
              onChange={(e) => onUpdate({ ...task, description: e.target.value })}
              size="md"
              fontSize="md"
              resize="none"
            />

            {/* Integrate MediaUploader component */}
            <MediaUploader
              taskId={task.id}
              tags={tags}
              onUpdate={fetchMedia} // Callback to refresh media after upload
            />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewTaskDrawer;