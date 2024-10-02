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
  Badge,
} from '@chakra-ui/react';
import { FaBell, FaCheck } from 'react-icons/fa';
import { getNotificationsByUserId, markNotificationSeen, getUnreadNotificationsCount } from '../Services/NotificationService';

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
  const [unreadCount, setUnreadCount] = useState(0);

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

    const fetchUnreadCount = async () => {
      try {
        const response = await getUnreadNotificationsCount(userId);
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error('Error fetching unread notifications count:', error);
      }
    };

    if (isOpen) {
      fetchNotifications();
      fetchUnreadCount();

      // Poll for new notifications and unread count every 5 seconds
      const interval = setInterval(() => {
        fetchNotifications();
        fetchUnreadCount();
      }, 5000);

      // Clear interval on component unmount or when popover closes
      return () => clearInterval(interval);
    }
  }, [isOpen, userId]); // Dependencies are isOpen and userId

  const onMarkAsRead = async (notificationId) => {
    try {
      await markNotificationSeen(notificationId, userId);
      setNotifications((prevNotifications) =>
        prevNotifications.filter(notification => notification.id !== notificationId)
      );

      // Refresh the unread count
      const response = await getUnreadNotificationsCount(userId);
      setUnreadCount(response.data.count); // Use the passed setter function
    } catch (err) {
      setError('Failed to mark notification as read.');
      console.error(err);
    }
  };

  // Sort notifications by creation date (newest first)
  const sortedNotifications = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Popover isOpen={isOpen} onClose={onToggle}>
      <PopoverTrigger>
        <Box position="relative">
          <IconButton
            icon={<FaBell size={20} />}
            aria-label="Notifications"
            variant="outline"
            colorScheme="gray.500"
            ml={2}
            onClick={onToggle}
          />
          {/* Badge for unread notifications */}
          {unreadCount > 0 && (
            <Badge
              colorScheme="red"
              position="absolute"
              top="-5px"
              right="-10px"
              borderRadius="full"
              fontSize="0.8em"
              paddingX="0.5em"
            >
              {unreadCount}
            </Badge>
          )}
        </Box>
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
                  <Box width="full" key={notification.id}>
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
                        <HStack justifyContent="space-between">
                          <Button bg="transparent" onClick={() => onMarkAsRead(notification.id)}>
                            <FaCheck size={15} />
                          </Button>
                          <Box display="flex" alignItems="center">
                            <Text fontSize="xs" color="gray.500">
                              {new Date(notification.createdAt).toLocaleString()}
                            </Text>
                          </Box>
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
