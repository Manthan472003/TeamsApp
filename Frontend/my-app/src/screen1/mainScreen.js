// screen/mainScreen.js
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
// import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom'; // Used for nested routes

const MainScreen = () => {
  return (
    <Flex direction="column" height="100vh">
      {/* <Header /> */}
      <Flex flex="1">
        <Sidebar />
        <Box
          ml="300px" 
          p={4}
          flex="1"
          overflowY="auto" 
        >
          <Outlet /> 
          
        </Box>

      </Flex>
    </Flex>
  );
};

export default MainScreen;