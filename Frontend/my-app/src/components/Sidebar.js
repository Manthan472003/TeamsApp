// components/Sidebar.js
import React, { useState } from 'react';
import { Box, VStack, Button } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styles/Sidebar.css'; 

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(location.pathname); 

  const handleNavigation = (path) => {
    navigate(path);
    setActiveButton(path); 
  };

  return (
    <Box className="sidebar">
      <VStack spacing={4} align="stretch">
        <Button
          className={`sidebar-button ${activeButton === '/home' ? 'active' : ''}`}
          onClick={() => handleNavigation('/home')}
        >
          Home
        </Button>
        <Button
          className={`sidebar-button ${activeButton === '/completed-tasks' ? 'active' : ''}`}
          onClick={() => handleNavigation('/completed-tasks')}
        >
          Completed Tasks
        </Button>
        <Button
          className={`sidebar-button ${activeButton === '/bin' ? 'active' : ''}`}
          onClick={() => handleNavigation('/bin')}
        >
          Bin
        </Button>
        <Button
          className={`sidebar-button ${activeButton === '/tech-used' ? 'active' : ''}`}
          onClick={() => handleNavigation('/tech-used')}
        >
          Technology Used
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
