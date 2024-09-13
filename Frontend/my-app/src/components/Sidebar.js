import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, VStack, Button, Flex, Image, Text, Menu, MenuButton, MenuList, MenuItem, Collapse, useDisclosure, useToast
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon, DeleteIcon, ArrowRightIcon, HamburgerIcon, ChevronDownIcon, PlusSquareIcon } from '@chakra-ui/icons';
import logo from '../assets/logo.png'; 
import AddSectionModal from './AddSectionModal';
import AddTaskModal from './AddTaskModal';
import { getSections } from '../Services/SectionService'; 

const Sidebar = ({ onSectionAdded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(location.pathname);
  const [userName, setUserName] = useState('');
  const [isOpen, setIsOpen] = useState(location.pathname === '/Home'); // Manage Collapse state
  const { isOpen: isSectionOpen, onOpen: onSectionOpen, onClose: onSectionClose } = useDisclosure();
  const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure();
  const toast = useToast();

  // Fetch sections list
  const fetchSections = useCallback(async () => {
    try {
      const response = await getSections();
      if (response && response.data) {
        // Handle sections data if needed
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Fetch Sections Error:', error);
    }
  }, []);

  useEffect(() => {
    fetchSections();
    const loggedInUser = localStorage.getItem('userName');
    if (loggedInUser) {
      setUserName(loggedInUser);
    }
  }, [fetchSections]);

  const handleNavigation = (path) => {
    setActiveButton(path);
    if (path === '/Home') {
      setIsOpen(true); // Open Collapse when navigating to Home
    } else {
      setIsOpen(false); // Close Collapse when navigating elsewhere
    }
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleSectionAdded = async () => {
    await fetchSections(); 
    if (onSectionAdded) {
      onSectionAdded(); // Notify TaskManager to refresh
    }
    toast({
      title: "Section added.",
      description: "The new section was successfully added.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleTaskAdded = async () => {
    toast({
      title: "Task added.",
      description: "The new task was successfully added.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const buttonStyles = {
    base: {
      fontSize: '18px',
      fontWeight: 'bold',
      borderWidth: '1px',
      borderColor: 'white',
      color: '#086F83',
      padding: '8px 6px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      marginBottom: '2px',
      width: '100%',
      textAlign: 'left',
      justifyContent: 'start',
    },
    hover: {
      color: '#ffffff',
      background: "#007bff",
    },
    active: {
      borderWidth: '2px',
      borderColor: '#007bff',
      backgroundImage: "linear-gradient(288deg, rgba(0,85,255,1) 1.5%, rgba(4,56,115,1) 91.6%)",
      color: '#ffffff',
      _hover: {
        backgroundImage: "linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)",
      },
    },
  };

  return (
    <Box
      width="250px"
      padding="16px"
      backgroundColor="#eeeffd"
      color="#97a1bf"
      height="100vh"
      position="fixed"
      top="0"
      left="0"
      display="flex"
      flexDirection="column"
    >
      <Flex direction="row" align="center" mb={4}>
        <Image src={logo} alt="App Logo" boxSize="40px" />
        <Text
          color="#ff6e7f"
          fontSize="3xl"
          fontWeight="bold"
          ml={4}
          onClick={handleReload}
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
        >
          OrganizeIt
        </Text>
      </Flex>

      <VStack
        spacing={4}
        align="start"
        background="#FFFFFF"
        padding={4}
        borderRadius="md"
        flex="1"
        position="relative"
      >
        <Button
          leftIcon={<PlusSquareIcon />}
          {...buttonStyles.base}
          {...(activeButton === '/Home' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/Home')}
          fontSize={15}
        >
          Dashboard
        </Button>
        <Collapse in={isOpen}>
          <VStack align="start" spacing={2} paddingLeft={4} paddingBottom={2}>
            <Button
              {...buttonStyles.base}
              onClick={onSectionOpen}
              width="150px"
            >
              Add Section
            </Button>
            <AddSectionModal
              isOpen={isSectionOpen}
              onClose={onSectionClose}
              onSectionAdded={handleSectionAdded}
            />

            <Button
              {...buttonStyles.base}
              onClick={onTaskOpen}
              width="150px"
            >
              Add Task
            </Button>
            <AddTaskModal
              isOpen={isTaskOpen}
              onClose={onTaskClose}
              onSubmit={handleTaskAdded}
              userId={userName}
              sectionID={null} 
            />
          </VStack>
        </Collapse>

        <Button
          leftIcon={<CheckCircleIcon />}
          {...buttonStyles.base}
          {...(activeButton === '/completed-tasks' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/completed-tasks')}
          fontSize={15}
        >
          Completed Tasks
        </Button>
        <Button
          leftIcon={<DeleteIcon />}
          {...buttonStyles.base}
          {...(activeButton === '/bin' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/bin')}
          fontSize={15}
        >
          Bin
        </Button>
        <Button
          leftIcon={<ArrowRightIcon />}
          {...buttonStyles.base}
          {...(activeButton === '/tech-used' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/tech-used')}
          fontSize={15}
        >
          Version Management
        </Button>
      </VStack>

      <Flex
        direction="column"
        align="center"
        mt="auto"
        padding="16px"
        backgroundColor="#ecf2f7"
      >
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<HamburgerIcon />}
            colorScheme="#086F83"
            width="215px"
            backgroundImage="linear-gradient(288deg, rgba(0,85,255,1) 1.5%, rgba(4,56,115,1) 91.6%)"
            color="white"
          >
            Hi, {userName || 'User'}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate('/profile')}>Profile Settings</MenuItem>
            <MenuItem onClick={handleLogout} colorScheme="red">Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Sidebar;
