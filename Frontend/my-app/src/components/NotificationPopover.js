import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
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
  Divider,
  useDisclosure
} from '@chakra-ui/react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { getNotificationsByUserId, markNotificationSeen, getUnreadNotifications } from '../Services/NotificationService';

const colorPalette = [
  "#ffddd6", // Color for unread notifications
  "#dcfce2"  // Color for read notifications
];

const NotificationPopover = ({ userId, setUnreadCount, unreadCount }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState([]);
  const [, setError] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  // const [unreadCount, setUnreadCount] = useState(0);

  // const fetchUnreadCount = useCallback(async () => {
  //   try {
  //     const response = await getUnreadNotificationsCount(userId);
  //     setUnreadCount(response.data.count);
  //   } catch (error) {
  //     console.error('Error fetching unread notifications count:', error);
  //   }
  // }, [userId]);

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
      const interval = setInterval(() => {
        fetchNotifications();
      }, 5000);
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

    }
  }, [userId, isOpen]);

  const onMarkUnreadAsRead = async (notificationId) => {
    try {
      await markNotificationSeen(notificationId, userId);
      setUnreadNotifications((prevUnreadNotifications) =>
        prevUnreadNotifications.filter(notification => notification.id !== notificationId)
      );

      // Decrement the unread count by 1 and ensure it doesn't go below 0
      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (err) {
      setError('Failed to mark notification as read.');
      console.error(err);
    }
  };

  const sortedNotifications = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const sortedUnreadNotifications = unreadNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <IconButton
        icon={<FaBell size={20} />}
        aria-label="Notifications"
        variant="outline"
        colorScheme="gray.500"
        ml={2}
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md" closeOnOverlayClick={false}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="lg" fontWeight="bold">Notifications</DrawerHeader>
          <DrawerBody>
            <Tabs isFitted variant='enclosed'>
              <Flex justify="center" align="center">
                <TabList width="full" justifyContent="space-between">
                  <Tab flex="1" _selected={{ color: 'white', bg: 'green.400' }} textAlign="center">Unread
                    {unreadCount > 0 && (
                      <Badge
                        variant='solid'
                        colorScheme="red"
                        position="absolute"
                        top="10px"
                        left="14px"
                        borderRadius="full"
                        fontSize="0.9em"
                        paddingX="0.5em"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Tab>
                  <Tab flex="1" _selected={{ color: 'white', bg: 'blue.500' }} textAlign="center">All</Tab>
                </TabList>
              </Flex>
              <Box overflowY="auto" maxHeight="calc(100vh - 200px)"> {/* Adjust this value as needed */}
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={3} align="start">
                      {sortedUnreadNotifications.length === 0 ? (
                        <Text color="gray.500">No new notifications</Text>
                      ) : (
                        sortedUnreadNotifications.map((notification) => {
                          let heading = "Notification";
                          // Determine heading based on notification text
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
                            <Box width="full" key={notification.id} position="relative">
                              <Box
                                p={2}
                                borderRadius="md"
                                bg={colorPalette[0]}
                                width="100%"
                                textAlign="justify"
                                whiteSpace="normal"
                                overflow="visible"
                                textOverflow="clip"
                              >
                                <Button
                                  bg="transparent"
                                  position="absolute"
                                  top={2}
                                  right={2}
                                  size={15}
                                  onClick={() => onMarkUnreadAsRead(notification.id)}
                                  aria-label="Mark as read"
                                  border="2px solid transparent"
                                  _hover={{
                                    borderColor: 'red.500',
                                    bg: 'transparent',
                                  }}
                                  _focus={{
                                    outline: 'none',
                                  }}
                                >
                                  <FaTimes size={15} />
                                </Button>
                                <Text fontWeight="bold" fontSize="md">{heading}</Text>
                                <Divider my={1} borderColor="gray.700" />
                                <Text fontSize="sm">{notification.notificationText}</Text>
                                <Box mt={2}>
                                  <HStack>
                                    <Box display="flex" justifyContent="flex-end">
                                      <Text fontSize="xs" color="gray.500">
                                        {new Date(notification.createdAt).toLocaleString()}
                                      </Text>
                                    </Box>
                                  </HStack>
                                </Box>
                              </Box>
                            </Box>
                          );
                        })
                      )}
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={3} align="start">
                      {sortedNotifications.length === 0 ? (
                        <Text color="gray.500">No new notifications</Text>
                      ) : (
                        sortedNotifications.map((notification) => {
                          let heading = "Notification";
                          // Determine heading based on notification text
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
                                bg={unreadNotifications.some(unread => unread.id === notification.id) ? colorPalette[0] : colorPalette[1]}
                                width="100%"
                                textAlign="justify"
                                whiteSpace="normal"
                                overflow="visible"
                                textOverflow="clip"
                              >
                                <Text fontWeight="bold" fontSize="md">{heading}</Text>
                                <Divider my={1} borderColor="gray.700" />
                                <Text fontSize="sm">{notification.notificationText}</Text>
                                <Box mt={1} display="flex" justifyContent="flex-start">
                                  <Text fontSize="xs" color="gray.500">
                                    {new Date(notification.createdAt).toLocaleString()}
                                  </Text>
                                </Box>
                              </Box>
                            </Box>
                          );
                        })
                      )}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Box>
            </Tabs>
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NotificationPopover;