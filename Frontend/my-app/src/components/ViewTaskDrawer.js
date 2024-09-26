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
  Input,
  Select,
  Button,
  useToast,
  DrawerFooter,
  Box,
  SimpleGrid,
  HStack
} from '@chakra-ui/react';
import { getMediaOfTheTask } from '../Services/MediaService';
import { updateTask } from '../Services/TaskService';
import { getCommentsByTaskId, createComment } from '../Services/CommentService'; // Import comment services
import MediaUploader from './MediaUploader';
import UserDropdown from './UserDropdown';
import TagDropdown from './TagDropdown';
import jwt_decode from 'jwt-decode'; // Import jwt-decode
import { getUsers } from '../Services/UserService'; // Import the getUsers function




const ViewTaskDrawer = ({ isOpen, onClose, task, tags, onUpdate = () => { } }) => {
  const [size] = useState('xl');
  const toast = useToast();
  const [localTask, setLocalTask] = useState(task);
  const [comments, setComments] = useState([]); // State for comments
  const [newComment, setNewComment] = useState(''); // State for new comment
  const [timeoutId, setTimeoutId] = useState(null);
  const [users, setUsers] = useState([]); // Ensure users are also fetched and managed


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

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers(); // Assuming getUsers function is available
      setUsers(response.data); // Assuming response.data contains the array of users
    } catch (error) {
      console.error('Fetch Users Error:', error);
      toast({
        title: "Error fetching users.",
        description: "Unable to fetch users. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const fetchComments = useCallback(async () => {
    if (!task || !task.id) return;
    try {
      const response = await getCommentsByTaskId(task.id);
      setComments(response.data); // Set fetched comments
    } catch (error) {
      toast({
        title: 'Error fetching comments.',
        description: 'Could not load comments.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [task, toast]);

  useEffect(() => {
    if (isOpen && task) {
      setLocalTask(task);
      fetchUsers();
      fetchMedia();
      fetchComments(); // Fetch comments when the drawer opens
    }
  }, [isOpen, task, fetchMedia, fetchComments, fetchUsers]);

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

  const getUserNameById = (userId) => {
    if (!users || users.length === 0) {
      console.error('Users data is not available');
      return 'Unknown';
    }

    const user = users.find(user => user.id === userId);
    if (!user) {
      console.error(`No user found for ID: ${userId}`);
      return 'Unknown';
    }
    return user.userName;
  };

  const token = localStorage.getItem('token'); // Fetch the token from local storage
  if (token) {
    var decoded = jwt_decode(token); // Decode the JWT token
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // Prevent empty comments
    try {
      const commentData = {
        commentText: newComment,
        taskId: task.id,
        createdByUserId: decoded.id, // Replace with actual user ID from your state
      };
      await createComment(commentData); // Call the createComment service

      // Add a new comment locally, including the createdAt timestamp
      setComments([...comments, {
        commentText: newComment,
        createdByUserId: decoded.id,
        createdAt: new Date().toISOString() // Ensure valid date format
      }]);

      setNewComment(''); // Clear the input field
    } catch (error) {
      toast({
        title: "Comment Submission Failed",
        description: "There was an error submitting your comment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
  }

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

  // Define a color palette
  const colorPalette = [
    "#ffddd6", // Color 1
    "#d0f5d7", // Color 2
    "#dee4ff", // Color 3
    "#fadcec", // Color 4
    "#fff1d4", // Color 5
    "#d4fffc",
    "#feffd4",
    "#edd4ff"
    // Add more colors as needed
  ];

  const getUserColor = (userId) => {
    // Use the user ID modulo the length of the color palette to cycle through colors
    const userIndex = userId % colorPalette.length; // Ensure you get a valid index
    return colorPalette[userIndex];
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
              <SimpleGrid columns={1} spacing={4}>
                <Box>
                  <Text mt={2} mb={2} fontSize="lg" fontWeight="bold">Task Name:</Text>
                  <Input
                    value={localTask.taskName || ''}
                    onChange={(e) => handleFieldChange('taskName', e.target.value)}
                  />
                </Box>

                <SimpleGrid columns={3} spacing={4}>
                  <Box>
                    <Text fontSize="lg" fontWeight="bold">Due Date:</Text>
                    <Input
                      mt={2}
                      type="date"
                      value={localTask.dueDate || ''}
                      onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                    />
                  </Box>

                  <Box>
                    <Text mb={2} fontSize="lg" fontWeight="bold">Assigned To:</Text>
                    <UserDropdown
                      selectedUser={localTask.taskAssignedToID}
                      onUserSelect={(userId) => handleFieldChange('taskAssignedToID', userId)}
                    />
                  </Box>

                  <Box>
                    <Text fontSize="lg" fontWeight="bold">Status:</Text>
                    <Select
                      mt={2}
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

                <SimpleGrid columns={3} spacing={4}>
                  <Box>
                    <Text fontSize="lg" fontWeight="bold">Due Date:</Text>
                    <Input
                      mt={2}
                      type="date"
                      value={localTask.dueDate || ''}
                      onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                    />
                  </Box>

                  <Box>
                    <Text mb={2} fontSize="lg" fontWeight="bold">Assigned To:</Text>
                    <UserDropdown
                      selectedUser={localTask.taskAssignedToID}
                      onUserSelect={(userId) => handleFieldChange('taskAssignedToID', userId)}
                    />
                  </Box>

                  <Box>
                    <Text fontSize="lg" fontWeight="bold">Status:</Text>
                    <Select
                      mt={2}
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

                <Box>
                  <Text fontSize="lg" fontWeight="bold">Tags:</Text>
                  <TagDropdown
                    selectedTags={localTask.tagIDs || []}
                    onTagSelect={(selectedTags) => handleFieldChange('tagIDs', selectedTags)}
                    taskId={task.id}
                  />
                </Box>
              </SimpleGrid>


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

              {/* Comment Section */}
              <Box mt={2} p={4} borderWidth={1} borderRadius="md" backgroundColor="#f9f9f9" boxShadow="sm">
                <Text fontSize="lg" fontWeight="bold" mb={3}>Comments:</Text>

                <VStack align="start" spacing={3}>
                  {comments.map((comment, index) => {
                    const isUserComment = comment.createdByUserId === decoded.id; // Check if the comment is by the logged-in user
                    const commentColor = getUserColor(comment.createdByUserId); // Get the color for the comment

                    // Format the created date
                    const formattedDate = new Date(comment.createdAt).toLocaleString(); // Adjust according to your date format

                    return (
                      <HStack
                        key={index}
                        p={2}
                        borderWidth={1}
                        borderRadius="md"
                        backgroundColor={isUserComment ? "#e0f7fa" : commentColor} // Use assigned color for user comments
                        boxShadow="sm"
                        width="full"
                        alignSelf={isUserComment ? "flex-end" : "flex-start"} // Align comments
                        maxWidth="100%" // Ensures the comment box doesn't exceed the parent's width
                      >
                        <Box flex="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="normal" width={12}>
                          <Text fontWeight="bold" color={isUserComment ? "blue.600" : "gray.600"}>
                            {isUserComment ? "You" : getUserNameById(comment.createdByUserId)}:
                          </Text>
                          <Text>{comment.commentText}</Text>
                          <Text fontSize="sm" color="gray.500" textAlign="right">{formattedDate}</Text> {/* Display date and time */}
                        </Box>
                      </HStack>
                    );
                  })}
                </VStack>

                <HStack mt={4}>
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    size="lg"
                    borderRadius="md"
                    borderWidth={1}
                    borderColor="gray.300"
                  />
                  <Button onClick={handleCommentSubmit} colorScheme="blue" size="sm">Comment</Button>
                </HStack>
              </Box>


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
