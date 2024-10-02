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
  HStack,
  Button,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { getNotificationsByUserId, markNotificationSeen } from '../Services/NotificationService';

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

const NotificationPopover = ({ isOpen, onToggle, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [, setError] = useState(null);

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

  // Sort notifications by creation date (newest first)
  const sortedNotifications = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const onMarkAsRead = async (notificationId) => {
    try {
      await markNotificationSeen(userId, notificationId); // Call the API to mark as seen
      setNotifications((prevNotifications) =>
        prevNotifications.filter(notification => notification.id !== notificationId)
      ); // Remove the notification from the state
    } catch (err) {
      setError('Failed to mark notification as read.');
      console.error(err);
    }
  };

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
        width="320px"
        maxHeight="400px"
        boxShadow="lg"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        bg="white"
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontSize="lg" fontWeight="bold" borderBottom="1px" borderColor="gray.200">
          Notifications
        </PopoverHeader>
        <PopoverBody p={3} overflowY="auto" maxHeight="300px">
          {sortedNotifications.length === 0 ? (
            <Text color="gray.500">No new notifications</Text>
          ) : (
            <VStack spacing={3} align="start">
              {sortedNotifications.map((notification) => {
                let heading = "Notification"; // Default heading

                if (notification.notificationText.includes("New task created")) {
                  heading = "Task Created";
                } else if (notification.notificationText.includes("reassigned")) {
                  heading = "Task Reassigned";
                } else if (notification.notificationText.includes("due date ")) {
                  heading = "Due Date Updated";
                } else if (notification.notificationText.includes("Task Completed")) {
                  heading = "Task Completed";
                }

                return (
                  <Box key={notification.id}>
                    <Text fontWeight="bold" fontSize="md">{heading}</Text>
                    <Box
                      p={2}
                      borderRadius="md"
                      bg={colorPalette[Math.floor(Math.random() * colorPalette.length)]}
                      width="100%"
                      textAlign="justify"
                      whiteSpace="normal"
                      overflow="visible"
                      textOverflow="clip"
                    >
                      <Text fontSize="sm">{notification.notificationText}</Text>
                      <Box>
                        <HStack>
                          <Button onClick={() => onMarkAsRead(notification.id)}>
                            Mark as Read
                          </Button>
                          <Text fontSize="xs" color="gray.500" display="flex" justifyContent="flex-end" alignItems="center" mt={1}>
                            {new Date(notification.createdAt).toLocaleString()}
                          </Text>
                        </HStack>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
