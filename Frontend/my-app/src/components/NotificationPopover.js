import React, { useEffect, useState, useCallback } from 'react';
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
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Flex,
  Badge,
  Divider
} from '@chakra-ui/react';
import { FaBell, FaCheck } from 'react-icons/fa';
import { getNotificationsByUserId, markNotificationSeen, getUnreadNotifications, getUnreadNotificationsCount } from '../Services/NotificationService';

const colorPalette = [
  "#ffddd6", // Color for unread notifications
  "#dcfce2"  // Color for read notifications
];

const NotificationPopover = ({ isOpen, onToggle, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [, setError] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // State to store unread count

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadNotificationsCount(userId);
      setUnreadCount(response.data.count); // Update unread count
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  }, [userId]);

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

      // Poll for new notifications and unread count every 5 seconds
      const interval = setInterval(() => {
        fetchNotifications();
      }, 5000);

      // Clear interval on component unmount or when popover closes
      return () => clearInterval(interval);
    }
  }, [isOpen, userId]);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await getUnreadNotifications(userId);
        if (response && response.data) {
          setUnreadNotifications(response.data);
        } else {
          setUnreadNotifications([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (isOpen) {
      fetchUnreadNotifications();
    }
    if (userId) {
      fetchUnreadCount(); // Initial fetch when Sidebar loads

      // Set interval to fetch unread count every 3 seconds
      const intervalId = setInterval(() => {
        fetchUnreadCount();
      }, 3000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [userId, isOpen, fetchUnreadCount]);

  const onMarkUnreadAsRead = async (notificationId) => {
    try {
      await markNotificationSeen(notificationId, userId);
      setUnreadNotifications((prevUnreadNotifications) =>
        prevUnreadNotifications.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      setError('Failed to mark notification as read.');
      console.error(err);
    }
  };

  const sortedNotifications = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const sortedUnreadNotifications = unreadNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
        </Box>
      </PopoverTrigger>
      <PopoverContent
        width="320px"
        height="400px"
        boxShadow="lg"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        bg="white"
        p={0} // Remove padding
        m={0} // Remove margin
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontSize="lg" fontWeight="bold" borderBottom="1px" borderColor="gray.200">
          Notifications
        </PopoverHeader>
        <Tabs isFitted variant='enclosed'>
          <Flex justify="center" align="center">
            <TabList width="full" justifyContent="space-between">
              <Tab flex="1" _selected={{ color: 'white', bg: 'blue.500' }} textAlign="center">All</Tab>
              <Tab flex="1" _selected={{ color: 'white', bg: 'green.400' }} textAlign="center">Unread
                {unreadCount > 0 && (
                  <Badge
                    variant='solid'
                    colorScheme="red"
                    position="absolute"
                    top="10px"
                    right="14px"
                    borderRadius="full"
                    fontSize="0.9em"
                    paddingX="0.5em"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Tab>
            </TabList>
          </Flex>
          <TabPanels>
            <TabPanel>
              <PopoverBody width="full" overflowY="auto" maxHeight="300px">
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
                          <Box
                            p={2}
                            borderRadius="md"
                            bg={unreadNotifications.some(unread => unread.id === notification.id) ? colorPalette[0] : colorPalette[1]} // Conditional color
                            width="100%"
                            textAlign="justify"
                            whiteSpace="normal"
                            overflow="visible"
                            textOverflow="clip"
                          >
                            <Text color="" fontWeight="bold" fontSize="md">{heading}</Text>
                            <Divider my={1} borderColor="gray.700" />
                            <Text fontSize="sm">{notification.notificationText}</Text>
                            <Box display="flex" justifyContent="flex-end">
                              <Text fontSize="xs" color="gray.500">
                                {new Date(notification.createdAt).toLocaleString()}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </VStack>
                )}
              </PopoverBody>
            </TabPanel>

            <TabPanel>
              <PopoverBody p={3} overflowY="auto" maxHeight="300px">
                {sortedUnreadNotifications.length === 0 ? (
                  <Text color="gray.500">No new notifications</Text>
                ) : (
                  <VStack spacing={3} align="start">
                    {sortedUnreadNotifications.map((notification) => {
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
                            bg={colorPalette[0]} // Color for unread notifications
                            width="100%"
                            textAlign="justify"
                            whiteSpace="normal"
                            overflow="visible"
                            textOverflow="clip"
                          >
                            <Text fontSize="sm">{notification.notificationText}</Text>

                            <Box mt={2}>
                              <HStack justifyContent="space-between">
                                <Button bg="transparent" width={50} height={5} onClick={() => onMarkUnreadAsRead(notification.id)}>
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;