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
  Input,
  Select,
    Button,
  useToast,
  DrawerFooter,
  Box,
  SimpleGrid,
} from '@chakra-ui/react';
import { getMediaOfTheTask } from '../Services/MediaService';
import { updateTask } from '../Services/TaskService';
import MediaUploader from './MediaUploader';
import UserDropdown from './UserDropdown';
import TagDropdown from './TagDropdown';

const ViewTaskDrawer = ({ isOpen, onClose, task, tags, onUpdate = () => { } }) => {
  const [size] = useState('xl');
  const toast = useToast();
  const [localTask, setLocalTask] = useState(task);
  const [timeoutId, setTimeoutId] = useState(null);

  const fetchMedia = useCallback(async () => {
    if (!task || !task.id) return;
    try {
      await getMediaOfTheTask(task.id);
    } catch (error) {
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
      setLocalTask(task);
      fetchMedia();
    }
  }, [isOpen, task, fetchMedia]);

  const handleFieldChange = (field, value) => {
    const updatedTask = { ...localTask, [field]: value };
    setLocalTask(updatedTask);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(async () => {
      await updateTask(updatedTask); // Update task on field change if needed
    }, 500);

    setTimeoutId(newTimeoutId);
  };

  const handleSaveAndClose = async () => {
    if (localTask) {
      try {
        await updateTask(localTask);
        onUpdate(localTask);
        toast({
          title: "Task Updated",
          description: "The task has been successfully updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close the drawer after saving
      } catch (error) {
        console.error('Failed to update task:', error);
        toast({
          title: "Update Failed",
          description: "There was an error updating the task.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  if (!localTask) {
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
  };
  const buttonStyles = {
    base: {
      fontSize: '23px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundImage: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
      padding: '8px 6px',
      borderRadius: '0 0 0 0',
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
            <Box pb="100">
              <Table variant="simple">
                <Tbody>
                  <Tr fontSize="lg">
                    <Td fontWeight="bold">Task Name:</Td>
                    <Td>
                      <Input
                        value={localTask.taskName || ''}
                        onChange={(e) => handleFieldChange('taskName', e.target.value)}
                      />
                    </Td>
                  </Tr>


                  <Tr>
                <Td colSpan={2}>
                  <SimpleGrid columns={3} spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Due Date:</Text>
                      <Input 
                      mt={2 }
                        type="date"
                        value={localTask.dueDate || ''}
                        onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                      />
                    </Box>
                    <Box>
                      <Text mb={2} fontWeight="bold">Assigned To:</Text>
                      <UserDropdown 
                      
                        selectedUser={localTask.taskAssignedToID}
                        onUserSelect={(userId) => handleFieldChange('taskAssignedToID', userId)}
                      />
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Status:</Text>
                      <Select
                      mt={2 }
                        value={localTask.status || 'Not Started'}
                        onChange={(e) => handleFieldChange('status', e.target.value)}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                      </Select>
                    </Box>
                  </SimpleGrid>
                </Td>
              </Tr>

                  <Tr fontSize="lg">
                    <Td fontWeight="bold">Tags:</Td>
                    <Td>
                      <TagDropdown
                        selectedTags={localTask.tagIDs || []}
                        onTagSelect={(selectedTags) => handleFieldChange('tagIDs', selectedTags)}
                        taskId={task.id}
                      />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>


              <Text mt={2} mb={2} fontSize="lg"><strong>Sub-Task:</strong></Text>
              <Input
                placeholder="Enter Sub-task "
                value={localTask.subTask || ''}
                onChange={(e) => handleFieldChange('subTask', e.target.value)}
              />

              <Text mt={2} mb={2} fontSize="lg"><strong>Description:</strong></Text>
              <Input
                placeholder="Enter task description"
                value={localTask.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />

              <MediaUploader
                taskId={task.id}
                tags={tags}
                onUpdate={fetchMedia}
              />
            </Box>

            <DrawerFooter position="fixed" bottom="0" left="0" right="0" bg="white" zIndex="1">
              <Button colorScheme="blue" onClick={handleSaveAndClose} width="full">Update and Close</Button>
            </DrawerFooter>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewTaskDrawer;
