// components/Sidebar.js
import React from 'react';
import { Box, VStack, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box
      as="nav"
      width="250px"
      p={4}
      bg="teal.800"
      color="white"
      height="calc(100vh - 60px)" // Adjust based on the height of the header
      position="fixed"
      top="60px" // Position below the header
      left={0}
    >
      <VStack spacing={4} align="stretch">
        <Link onClick={() => navigate('/home')} fontSize="lg" fontWeight="bold">Home</Link>
        <Link onClick={() => navigate('/completed-tasks')} fontSize="lg">Completed Tasks</Link>
        <Link onClick={() => navigate('/bin')} fontSize="lg">Bin</Link>
        <Link onClick={() => navigate('/tech-used')} fontSize="lg">Technology Used</Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;