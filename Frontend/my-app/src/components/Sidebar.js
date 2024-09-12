// components/Sidebar.js
import React, { useState } from 'react';
import { Box, VStack, Button } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon, DeleteIcon, ArrowRightIcon,PlusSquareIcon } from '@chakra-ui/icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(location.pathname);

  const handleNavigation = (path) => {
    navigate(path);
    setActiveButton(path);
  };

  const buttonStyles = {
    base: {
      fontSize: '18px',
      fontWeight: 'bold',
      borderWidth: '1px',
      borderColor: 'white',
      background: "",
      color: '#086F83', // Changed from 'black' to '#000000' for proper color format
      padding: '8px 6px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      marginBottom: '2px',
      width: '100%',
      textAlign: 'left',
      justifyContent: 'start', // Align icon and text to the left
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
      backgroundColor="#ecf2f7"
      color="#97a1bf"
      height="calc(100vh - 60px)"
      position="fixed"
      top="60px"
      left="0"
    >
      <VStack
        spacing={4}
        align="start" // Align all children to the start (left)
        background="#FFFFFF"
        padding={4}
        borderRadius="md"
        height="100%" // Ensure VStack takes full height
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
    </Box>
  );
};

export default Sidebar;
