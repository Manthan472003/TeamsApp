import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, VStack, Button, Flex, Image, Text, useDisclosure, useToast, Menu, MenuButton, MenuList, MenuItem,
  SimpleGrid
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon, HamburgerIcon } from '@chakra-ui/icons';
import { MdAddTask, MdDashboard } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { HiOutlineFolderAdd } from "react-icons/hi";
import { RiInformationFill } from "react-icons/ri";
import { TbReport } from "react-icons/tb";
import logo from '../assets/logo.png';
import AddSectionModal from './AddSectionModal';
import AddTaskModal from './AddTaskModal';
import { getSections } from '../Services/SectionService';
import ConfirmLogoutModal from './ConfirmLogoutModal';
import jwt_decode from 'jwt-decode'; // Import jwt-decode

const Sidebar = ({ onSectionAdded, onTaskAdded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(location.pathname);
  const [userName, setUserName] = useState('');
  const [, setIsOpen] = useState(location.pathname === '/Home'); // Manage Collapse state
  const { isOpen: isSectionOpen, onOpen: onSectionOpen, onClose: onSectionClose } = useDisclosure();
  const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure();
  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();
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
    const token = localStorage.getItem('token'); // Fetch the token from local storage
    if (token) {
      const decoded = jwt_decode(token); // Decode the JWT token
      setUserName(decoded.userName); // Set the user information state
    }
  }, [fetchSections]);

  useEffect(() => {
    setActiveButton(location.pathname);
    if (location.pathname === '/Home') {
      setIsOpen(true); // Open Collapse when navigating to Home
    } else {
      setIsOpen(false); // Close Collapse when navigating elsewhere
    }
  }, [location.pathname]);

  const handleNavigation = (path) => {
    setActiveButton(path);
    navigate(path);
  };

  const handleLogout = () => {
    onLogoutOpen();
  };

  const confirmLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
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

    if (onTaskAdded) {
      await onTaskAdded();  // Notify TaskManager to refresh tasks
    }
  };

  const buttonStyles = {
    base: {
      fontSize: '15px',
      fontWeight: 'bold',
      borderWidth: '1px',
      borderColor: 'white',
      color: '#2D5BA8',
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
      backgroundImage: "linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)"
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
      width="300px"
      padding="16px"
      backgroundColor="#eeeffd"
      color="#2D5BA8"
      height="100vh"
      position="fixed"
      top="0"
      left="0"
      display="flex"
      flexDirection="column"
    >
      <Flex direction="row" align="center" mb={4}>
        <Image ml={8} src={logo} alt="App Logo" width="70px" height={10} />
        <Text
          color="#2D5BA8"
          fontSize="3xl"
          fontWeight="bold"
          ml={4}
          onClick={handleReload}
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
        >
          Copious
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

        <SimpleGrid columns={2} spacing={2} width="100%">
          <Button
            {...buttonStyles.base}
            {...(activeButton === '/add-section' && buttonStyles.active)}
            _hover={{ ...buttonStyles.hover }}
            onClick={onSectionOpen}
            flexDirection="column"
            alignItems="center"
            size="xl"
            padding={4}
          >
            <Box as={HiOutlineFolderAdd} size={24} mb={2} />
            Add Section
          </Button>
          <AddSectionModal
            isOpen={isSectionOpen}
            onClose={onSectionClose}
            onSectionAdded={handleSectionAdded}
          />

          <Button
            {...buttonStyles.base}
            {...(activeButton === '/add-task' && buttonStyles.active)}
            _hover={{ ...buttonStyles.hover }}
            onClick={onTaskOpen}
            flexDirection="column"
            alignItems="center"
            size="xl"
            padding={4}
          >
            <Box as={MdAddTask} size={24} mb={2} />
            Add Task
          </Button>
          <AddTaskModal
            isOpen={isTaskOpen}
            onClose={onTaskClose}
            onSubmit={handleTaskAdded}
            userId={userName}
            sectionID={null}
          />
        </SimpleGrid>

        <Button
          leftIcon={<MdDashboard size={20} />}
          {...buttonStyles.base}
          {...(activeButton === '/Home' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/Home')}
        >
          Dashboard
        </Button>


        {/* <Collapse in={isOpen}>
          <VStack align="start" spacing={0} paddingLeft={4} paddingBottom={2}>
            <Button
              leftIcon={<HiOutlineFolderAdd size={20} />}
              {...buttonStyles.base}
              onClick={onSectionOpen}
              width="200px"
            >
              Add Section
            </Button>
            <AddSectionModal
              isOpen={isSectionOpen}
              onClose={onSectionClose}
              onSectionAdded={handleSectionAdded}
            />

            <Button
              leftIcon={<MdAddTask size={20} />}
              {...buttonStyles.base}
              onClick={onTaskOpen}
              width="200px"
            >
              Add Task
            </Button>
            <AddTaskModal
              isOpen={isTaskOpen}
              onClose={onTaskClose}
              onSubmit={handleTaskAdded}  // Call handleTaskAdded after adding a task
              userId={userName}
              sectionID={null}
            />
          </VStack>
        </Collapse> */}

        <Button
          leftIcon={<CheckCircleIcon size={25} />}
          {...buttonStyles.base}
          {...(activeButton === '/completed-tasks' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/completed-tasks')}
        >
          Completed Tasks
        </Button>

        {/* <Button
          leftIcon={<DeleteIcon />}
          {...buttonStyles.base}
          {...(activeButton === '/bin' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/bin')}
        >
          Bin
        </Button> */}

        <Button
          leftIcon={<RiInformationFill size={18} />}
          {...buttonStyles.base}
          {...(activeButton === '/tech-used' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/tech-used')}
        >
          Version Management
        </Button>
        <Button
          leftIcon={<FaTasks />}
          {...buttonStyles.base}
          {...(activeButton === '/my-tasks' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/my-tasks')}
        >
          My Tasks
        </Button>
        <Button
          leftIcon={<TbReport size={20} />}
          {...buttonStyles.base}
          {...(activeButton === '/daily-reports' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/daily-reports')}
        >
          Daily Reports
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
            width="100%"
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
        <ConfirmLogoutModal
          isOpen={isLogoutOpen}
          onClose={onLogoutClose}
          onConfirm={confirmLogout}
        />
      </Flex>
    </Box>
  );
};

export default Sidebar;