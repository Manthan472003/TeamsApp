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
  HStack,
  useDisclosure
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
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
import ConfirmCompleteModal from './ConfirmCompleteModal';
import { createNotification } from '../Services/NotificationService';

const ViewTaskDrawer = ({ isOpen, onClose, task, tags, onUpdate = () => { }, onStatusChange }) => {
  const [size] = useState('xl');
  const toast = useToast();
  const [localTask, setLocalTask] = useState(task || {}); // Initialize with an empty object
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  const [users, setUsers] = useState([]);  // Ensure this state is populated before accessing
  const [previousAssignedUser, setPreviousAssignedUser] = useState(task?.taskAssignedToID || null); // Use optional chaining
  const [assignedUserEmail, setAssignedUserEmail] = useState('');
  const [previousDueDate, setPreviousDueDate] = useState(task?.dueDate || '');  // Store previousDueDate in state
  const [previousStatus, setPreviousStatus] = useState(task?.status || '');
  const [, setSections] = useState([]);

  const { isOpen: isCompleteOpen, onOpen: onCompleteOpen, onClose: onCompleteClose } = useDisclosure();
  const [taskToComplete, setTaskToComplete] = useState(null);


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
      console.log("Fetched Users:", response.data); // Check fetched users
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
      setPreviousDueDate(task.dueDate);  // Initialize previousDueDate when task loads
      setPreviousStatus(task.status);  // Initialize previousStatus when task loads
      fetchUsers();
      fetchMedia();
      fetchComments();
      fetchSections();
      fetchUserById(task.taskAssignedToID);
    }
  }, [isOpen, task, fetchUsers, fetchMedia, fetchComments, fetchSections, fetchUserById]);


  const handleFieldChange = (field, value) => {
    const updatedTask = { ...localTask, [field]: value };
    setLocalTask(updatedTask);

    // Handle timeout for task update (debounced)
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(async () => {
      await updateTask(updatedTask); // Only update the task, no email notifications here
    }, 500);

    setTimeoutId(newTimeoutId);

    // Update assignedUserEmail when due date is changed
    if (field === 'dueDate') {
      fetchUserById(localTask.taskAssignedToID);
    }
  };

  const handleSaveAndClose = async () => {
    if (localTask) {
      try {
        // Update the task first
        await updateTask(localTask);
        onUpdate(localTask); // Trigger any onUpdate callback

        const assignedUserID = localTask.taskAssignedToID;

        // Prepare to send notifications
        const notificationPromises = [];

        // Check if assigned user has changed and send email notification
        if (previousAssignedUser !== assignedUserID) {
          notificationPromises.push(sendEmailNotification('assignedUserChange', previousAssignedUser, assignedUserID));

          // Prepare notification for user assignment change
          try {
            await createNotification({
              notificationText: `Task "${localTask.taskName}" has been reassigned from User ID ${previousAssignedUser} to User ID ${assignedUserID}.`,
              userIds: [previousAssignedUser, assignedUserID],
            });
          } catch (error) {
            console.error('Error creating notification for assigned user change:', error.response ? error.response.data : error);
          }

          setPreviousAssignedUser(assignedUserID); // Update the state to reflect the new assigned user
        }

        // Check if the due date has changed and send email notification
        if (previousDueDate !== localTask.dueDate) {
          if (assignedUserEmail) {
            notificationPromises.push(sendEmailNotification('dueDateChange', null, null, localTask.dueDate));

            // Prepare notification for due date change
            try {
              await createNotification({
                notificationText: `The due date for task "${localTask.taskName}" has been updated to ${localTask.dueDate}.`,
                userIds: [assignedUserID], // Notify the current assigned user
              });
              setPreviousDueDate(localTask.dueDate); // Update previousDueDate after successful save
            } catch (error) {
              console.error('Error creating notification for due date change:', error.response ? error.response.data : error);
            }
          } else {
            await fetchUserById(localTask.taskAssignedToID);
            if (assignedUserEmail) {
              notificationPromises.push(sendEmailNotification('dueDateChange', null, null, localTask.dueDate));

              // Prepare notification for due date change
              try {
                await createNotification({
                  notificationText: `The due date for task "${localTask.taskName}" has been updated to ${localTask.dueDate}.`,
                  userIds: [assignedUserID], // Notify the current assigned user
                });
                setPreviousDueDate(localTask.dueDate); // Update previousDueDate after successful save
              } catch (error) {
                console.error('Error creating notification for due date change after fetching user:', error.response ? error.response.data : error);
              }
            }
          }
        }

        // Check if the task status has changed to 'Completed' and send email notification
        if (localTask.status === 'Completed' && previousStatus !== 'Completed') {
          notificationPromises.push(sendEmailNotification('taskCompleted'));

          // Prepare notification for task completion
          try {
            await createNotification({
              notificationText: `Congratulations! The task "${localTask.taskName}" has been successfully completed!`,
              userIds: [assignedUserID], // Notify the current assigned user
            });
            setPreviousStatus('Completed'); // Update previousStatus after successful save
          } catch (error) {
            console.error('Error creating notification for task completion:', error.response ? error.response.data : error);
          }
        }

        // Await all notification promises to ensure they are sent
        await Promise.all(notificationPromises);

        // Display success toast
        toast({
          title: "Task Updated",
          description: "The task has been successfully updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Close the drawer
        onClose();
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
  const sendEmailNotification = async (type, oldUserId = null, newUserId = null, changedDate = null) => {
    const emails = [];

    switch (type) {
      case 'dueDateChange':
        if (assignedUserEmail) {
          emails.push(assignedUserEmail);
        } else {
          console.warn('Assigned user email is not available.');
        }
        break;

      case 'assignedUserChange':
        if (oldUserId) {
          const oldEmail = await fetchUserEmailById(oldUserId);
          if (oldEmail) {
            const oldUserMessage = getEmailMessage(type, oldUserId, newUserId)?.oldUserMessage;
            emails.push({ email: oldEmail, message: oldUserMessage });
          } else {
            console.warn(`Old user email not found for ID: ${oldUserId}`);
          }
        }
        if (newUserId) {
          const newEmail = await fetchUserEmailById(newUserId);
          if (newEmail) {
            const newUserMessage = getEmailMessage(type, oldUserId, newUserId)?.newUserMessage;
            emails.push({ email: newEmail, message: newUserMessage });
          } else {
            console.warn(`New user email not found for ID: ${newUserId}`);
          }
        }
        break;

      case 'taskCompleted':
        if (assignedUserEmail) {
          emails.push(assignedUserEmail);
        }
        if (decoded?.email) {
          emails.push(decoded.email);
        }
        break;

      default:
        console.warn('Unknown email notification type.');
        break;
    }

    // Ensure valid emails before sending
    if (emails.length > 0) {
      const validEmails = emails.filter(item => item.email);  // Filter out any invalid emails
      if (validEmails.length > 0) {
        const message = getEmailMessage(type, oldUserId, newUserId, changedDate);
        await sendEmailToUsers(validEmails, 'Task Notification', message);
      } else {
        console.warn('No valid emails found to send notifications.');
      }
    } else {
      console.warn('No emails found for sending notifications.');
    }
  };

  // Helper function to fetch user email by ID
  const fetchUserEmailById = async (userId) => {
    if (!userId) {
      console.warn('Invalid userId:', userId);
      return null;  // Return null for invalid userId
    }

    try {
      const response = await getUser(userId);
      if (response?.data && response.data.email) {
        return response.data.email;
      } else {
        console.warn(`No email found for user with ID: ${userId}`);
        return null;  // Return null if no email found
      }
    } catch (error) {
      console.error('Error fetching user email:', error);
      return null;  // Return null on error
    }
  };

  // Function to construct email message based on type
  const getEmailMessage = (type, oldUserId = null, newUserId = null, changedDate = null) => {
    // const oldUserName = oldUserId ? getUserNameById(oldUserId) : 'Unknown';  // Skip lookup if oldUserId is invalid
    const newUserName = newUserId ? getUserNameById(newUserId) : 'Unknown';  // Skip lookup if newUserId is invalid

    switch (type) {
      case 'dueDateChange':
        return `🎉 Hello! \n\nThe due date for the task "${localTask.taskName}" has been updated to ${changedDate}. Please mark your calendars and stay on track!`;

      case 'assignedUserChange':
        return {
          oldUserMessage: `Relax! The task "${localTask.taskName}" has been reassigned to ${newUserName}.`,
          newUserMessage: `You are the new assignee of the task "${localTask.taskName}". Welcome aboard!`,
        };

      case 'taskCompleted':
        return `🏆 Congratulations! \n\nThe task "${localTask.taskName}" has been successfully completed! Thank you for your hard work and dedication!`;

      default:
        return `📬 Hello! \n\nYou have received a notification regarding the task "${localTask.taskName}". Please check your task list for more details.`;
    }
  };

  // Function to send emails to users
  const sendEmailToUsers = (emails, subject, message) => {
    emails.forEach(({ email, message }) => {
      if (!email) {
        console.error('No email address provided for sending:', email);
        return; // Skip if the email is invalid
      }

      sendEmail({
        email,
        subject,
        text: message,
        html: `<h1>${subject}</h1><p>${message}</p>`
      })
        .then(() => {
          console.log('Email sent successfully to:', email);
        })
        .catch((emailError) => {
          console.error('Error sending email:', emailError);
          toast({
            title: "Email Sending Failed",
            description: "Could not send email notifications.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    });
  };


  // Adjusted getUserNameById function
  const getUserNameById = (userId) => {
    if (!userId) {  // Handle null or undefined userId
      console.warn(`No valid user ID provided: ${userId}`);
      return 'Unknown';
    }

    if (!users || users.length === 0) {
      console.error('Users data is not available');
      return 'Unknown';
    }

    const user = users.find(user => String(user.id) === String(userId));  // Ensure ID comparison works even if types differ
    if (!user) {
      console.error(`No user found for ID: ${userId}`);
      return 'Unknown';  // Return 'Unknown' if user is not found
    }
    return user.userName;  // Return the user's name
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

  const handleCompleteClick = (task) => {
    setTaskToComplete(task);
    onCompleteOpen();
  };

  const confirmComplete = () => {
    console.log('onStatusChange:', onStatusChange);
    console.log('taskToComplete:', taskToComplete);
    if (onStatusChange && taskToComplete) {
      onStatusChange(taskToComplete.id, 'Completed');
      setTaskToComplete(null);
      onCompleteClose();
    } else {
      console.error('onStatusChange function is not defined');
    }
    onClose(); // Close the drawer immediately
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
    <>
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
                <Button colorScheme="green" onClick={() => handleCompleteClick(task)} width={400}>
                  {<CheckIcon />}
                  Completed
                </Button>
                <Button ml={400} colorScheme="blue" onClick={handleSaveAndClose} width={500}>Update Task</Button>
              </DrawerFooter>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {/* Complete Confirmation Modal */}
      <ConfirmCompleteModal
        isOpen={isCompleteOpen}
        onClose={onCompleteClose}
        onConfirm={confirmComplete}
        itemName={taskToComplete ? taskToComplete.taskName : ''}
      />
    </>
  );
};

export default ViewTaskDrawer;