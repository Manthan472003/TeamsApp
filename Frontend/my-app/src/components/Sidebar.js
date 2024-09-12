// components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Box, VStack, Button, Flex, Image, Text, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon, DeleteIcon, ArrowRightIcon, PlusSquareIcon, HamburgerIcon } from '@chakra-ui/icons';
import logo from '../assets/logo.png'; // Replace with the path to your logo image

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(location.pathname);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userName');
    if (loggedInUser) {
      setUserName(loggedInUser);
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setActiveButton(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleReload = () => {
    window.location.reload();
  };

  const buttonStyles = {
    base: {
      fontSize: '18px',
      fontWeight: 'bold',
      borderWidth: '1px',
      borderColor: 'white',
      background: "",
      color: '#086F83',
      padding: '8px 6px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      marginBottom: '2px',
      width: '100%', // Ensuring buttons take full width
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
      >
        <Button
          leftIcon={<PlusSquareIcon />}
          {...buttonStyles.base}
          {...(activeButton === '/home' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/home')}
        >
          Home
        </Button>
        <Button
          leftIcon={<CheckCircleIcon />}
          {...buttonStyles.base}
          {...(activeButton === '/completed-tasks' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/completed-tasks')}
        >
          Completed Tasks
        </Button>
        <Button
          leftIcon={<DeleteIcon />}
          {...buttonStyles.base}
          {...(activeButton === '/bin' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/bin')}
        >
          Bin
        </Button>
        <Button
          leftIcon={<ArrowRightIcon />}
          {...buttonStyles.base}
          {...(activeButton === '/tech-used' && buttonStyles.active)}
          _hover={{ ...buttonStyles.hover }}
          onClick={() => handleNavigation('/tech-used')}
        >
          Technology Used
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
