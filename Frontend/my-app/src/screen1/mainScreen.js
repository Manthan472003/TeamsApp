// screen/mainScreen.js
import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import Header from '../components/Header';  // Import the Header component
import Sidebar from '../components/Sidebar';  // Import the Sidebar component

const MainScreen = () => {
  return (
    <Flex direction="column" height="100vh">
      <Header />
      <Flex flex="1">
        <Sidebar />
        <Box
          ml="250px"
          p={4}
          flex="1"
          overflowY="auto" 
        >
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainScreen;