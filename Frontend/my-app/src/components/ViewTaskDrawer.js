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
import { getCommentsByTaskId, createComment } from '../Services/CommentService';
import MediaUploader from './MediaUploader';
import UserDropdown from './UserDropdown';
import TagDropdown from './TagDropdown';
import SectionDropdown from './SectionDropdown';
import jwt_decode from 'jwt-decode';
import { getUsers, getUser } from '../Services/UserService';
import { getSections } from '../Services/SectionService';
import { sendEmail } from '../Services/MailService';

const ViewTaskDrawer = ({ isOpen, onClose, task, tags, onUpdate = () => { } }) => {
  const [size] = useState('xl');
  const toast = useToast();
  const [localTask, setLocalTask] = useState(task || {}); // Initialize with an empty object
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  const [users, setUsers] = useState([]);
  const [previousAssignedUser, setPreviousAssignedUser] = useState(task?.taskAssignedToID || null); // Use optional chaining
  const [assignedUserEmail, setAssignedUserEmail] = useState('');

  const [, setSections] = useState([]);


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

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
      console.log("Fetched Users:", response.data); // Log fetched users
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


  const fetchSections = useCallback(async () => {
    try {
      const response = await getSections();
      setSections(response.data);
    } catch (error) {
      console.error('Fetch Sections Error:', error);
      toast({
        title: "Error fetching sections.",
        description: "Unable to fetch sections. Please try again.",
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
      setComments(response.data);
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

  // Fetch user by ID
  const fetchUserById = useCallback(async (userId) => {
    try {
      const response = await getUser(userId);
      if (response && response.data) {
        setAssignedUserEmail(response.data.email || ''); // Set the email state
      } else {
        console.warn('User not found or no email available');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, []);

  useEffect(() => {
    if (isOpen && task) {
      setLocalTask(task);
      setPreviousAssignedUser(task.taskAssignedToID);
      fetchUsers();
      fetchMedia();
      fetchComments();
      fetchSections();
      fetchUserById(task.taskAssignedToID); // Fetch email for initially assigned user
    }
  }, [isOpen, task, fetchUsers, fetchMedia, fetchComments, fetchSections, fetchUserById]);

  const handleFieldChange = (field, value) => {
    const updatedTask = { ...localTask, [field]: value };
    setLocalTask(updatedTask);

    if (field === 'taskAssignedToID') {
      fetchUserById(value); // Fetch email when assigned user changes
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(async () => {
      await updateTask(updatedTask);
    }, 500);

    setTimeoutId(newTimeoutId);
  };

  const handleSaveAndClose = async () => {
    if (localTask) {
      try {
        await updateTask(localTask); 
        onUpdate(localTask); 

        // Only send email if the assigned user has changed
        const assignedUserID = localTask.taskAssignedToID;
        if (previousAssignedUser !== assignedUserID) {
          if (assignedUserEmail) {
            sendEmailNotification();
          } else {
            console.warn('No email found for assigned user ID:', assignedUserID);
            toast({
              title: "No Email Found",
              description: "The assigned user does not have a valid email address.",
              status: "warning",
              duration: 5000,
              isClosable: true,
            });
          }
        }

        toast({
          title: "Task Updated",
          description: "The task has been successfully updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        onClose(); // Close the drawer immediately
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

  // Function to send email notification
  const sendEmailNotification = () => {
    sendEmail({
      email: assignedUserEmail,
      subject: 'Task Assigned to You',
      text: `You have been assigned a new task: ${localTask.taskName}`,
      html: `<h1>${localTask.taskName}</h1><p>You have been assigned a new task.</p>`
    })
      .then(() => {
        console.log('Email sent successfully to:', assignedUserEmail);
      })
      .catch((emailError) => {
        console.error('Error sending email:', emailError);
        toast({
          title: "Email Sending Failed",
          description: "Could not send email to the assigned user.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
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

  const token = localStorage.getItem('token');
  if (token) {
    var decoded = jwt_decode(token);
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const commentData = {
        commentText: newComment,
        taskId: task.id,
        createdByUserId: decoded.id,
      };
      await createComment(commentData);
      setComments([...comments, {
        commentText: newComment,
        createdByUserId: decoded.id,
        createdAt: new Date().toISOString()
      }]);

      setNewComment('');
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

  // Conditional rendering for task check
  if (!task) {
    return (
      <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Task Details</DrawerHeader>
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

  const colorPalette = [
    "#ffddd6",
    "#d0f5d7",
    "#dee4ff",
    "#fadcec",
    "#fff1d4",
    "#d4fffc",
    "#feffd4",
    "#edd4ff"
  ];

  const getUserColor = (userId) => {
    const userIndex = userId % colorPalette.length;
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
                      onUserSelect={(userId) => {
                        handleFieldChange('taskAssignedToID', userId);
                        setPreviousAssignedUser(localTask.taskAssignedToID);
                      }}
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

                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text mb={2} fontSize="lg" fontWeight="bold">Section:</Text>
                    <SectionDropdown
                      selectedSection={localTask.sectionID}
                      onSectionSelect={(sectionID) => handleFieldChange('sectionID', sectionID)}
                    />
                  </Box>

                  <Box>
                    <Text fontSize="lg" fontWeight="bold">Platform:</Text>
                    <Select
                      mt={2}
                      value={localTask.platformType || 'Platform-Independent'}
                      onChange={(e) => handleFieldChange('platformType', e.target.value)}
                    >
                      <option value="Platform-Independent">Platform-Independent</option>
                      <option value="iOS">iOS</option>
                      <option value="Android">Android</option>
                      <option value="Web">Web</option>
                      <option value="WindowsOS">WindowsOS</option>
                      <option value="MacOS">MacOS</option>
                      <option value="Linux">Linux</option>
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

              <Box mt={2} p={4} borderWidth={1} borderRadius="md" backgroundColor="#f9f9f9" boxShadow="sm">
                <Text fontSize="lg" fontWeight="bold" mb={3}>Comments:</Text>

                <VStack align="start" spacing={3}>
                  {comments.map((comment, index) => {
                    const isUserComment = comment.createdByUserId === decoded.id;
                    const commentColor = getUserColor(comment.createdByUserId);
                    const formattedDate = new Date(comment.createdAt).toLocaleString();

                    return (
                      <HStack
                        key={index}
                        p={2}
                        borderWidth={1}
                        borderRadius="md"
                        backgroundColor={isUserComment ? "#e0f7fa" : commentColor}
                        boxShadow="sm"
                        width="full"
                        alignSelf={isUserComment ? "flex-end" : "flex-start"}
                        maxWidth="100%"
                      >
                        <Box flex="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="normal" width={12}>
                          <Text fontWeight="bold" color={isUserComment ? "blue.600" : "gray.600"}>
                            {isUserComment ? "You" : getUserNameById(comment.createdByUserId)}:
                          </Text>
                          <Text>{comment.commentText}</Text>
                          <Text fontSize="sm" color="gray.500" textAlign="right">{formattedDate}</Text>
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
                  <Button onClick={handleCommentSubmit} colorScheme="blue" height="45px" size="sm">Comment</Button>
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
