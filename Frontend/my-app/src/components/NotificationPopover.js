import React, { useEffect, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  IconButton,
  Text,
  VStack,
  Box,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { getNotificationsByUserId } from '../Services/NotificationService';

const NotificationPopover = ({ isOpen, onToggle, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotificationsByUserId(userId);
        if (response && response.data) {
          setNotifications(response.data);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        setError('Failed to fetch notifications.');
        console.error(err);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, userId]);

  return (
    <Popover isOpen={isOpen} onClose={onToggle}>
      <PopoverTrigger>
        <IconButton
          icon={<FaBell size={20} />}
          aria-label="Notifications"
          variant="outline"
          colorScheme="gray.500"
          ml={2}
          onClick={onToggle}
        />
      </PopoverTrigger>
      <PopoverContent 
        width="320px" // Adjusted width for better aesthetics
        maxHeight="400px" // Fixed height with scrolling
        overflowY="auto" // Enable vertical scrolling
        boxShadow="lg" // Add a shadow for depth
        borderRadius="md" // Rounded corners
        border="1px" // Border style
        borderColor="gray.200" // Light border color
        bg="white" // Background color
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontSize="lg" fontWeight="bold" borderBottom="1px" borderColor="gray.200">
          Notifications
        </PopoverHeader>
        <PopoverBody p={3} overflowY="auto"> {/* Add padding and keep it scrollable */}
          {error && <Text color="red.500" mb={2}>{error}</Text>}
          {notifications.length === 0 ? (
            <Text color="gray.500">No new notifications</Text>
          ) : (
            <VStack spacing={2} align="start"> {/* Align items to start */}
              {notifications.map((notification) => (
                <Box 
                  key={notification.id} 
                  p={2} // Padding for each notification
                  borderRadius="md" // Rounded corners
                  bg="gray.50" // Light background for notifications
                  _hover={{ bg: "gray.100" }} // Hover effect
                  width="100%"
                  whiteSpace="nowrap" 
                  overflow="hidden" 
                  textOverflow="ellipsis"
                >
                  <Text fontSize="sm">{notification.notificationText}</Text>
                </Box>
              ))}
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
