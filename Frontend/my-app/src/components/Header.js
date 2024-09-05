import React, { useState } from 'react';
import { Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Img, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import userImage from '../screen1/user.png';
import SettingsModal from './SettingModal';

const Header = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => navigate('/login');
  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  // Handle settings submission
  const handleSettingsSubmit = (data) => {
    console.log('Settings submitted:', data);
    setSubmittedData(prevData => [...prevData, data]); // Add the new settings data to the existing data
    closeSettings(); // Close the modal after submission
  };

  return (
    <Flex
      direction="column"
      bg="teal.500"
      color="white"
      px={4}
      h="auto"
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      zIndex="overlay"
    >
      <Flex width="100%" mt={3} mb={3}>
        <Flex flex="1" alignItems="center">
          <Heading  size="md">WELCOME TO </Heading> <br/>          
          <Heading ml={2} as='i' color={'yellow'} size="lg">TEAMS APP !!</Heading>

        </Flex>
        <Flex alignItems="center">
          <Heading size="md" as='i' mr={4}>Hey, Manthan</Heading>
          <Menu>
            <MenuButton rounded="full" cursor="pointer" minW={0} variant="link">
              <Img src={userImage} alt="User Icon" boxSize="40px" />
            </MenuButton>
            <MenuList bgColor={'#ffffff'} color={'teal'}>
              <MenuItem>Your Profile</MenuItem>
              <MenuItem onClick={openSettings}>Settings</MenuItem>
              <MenuItem>
                <Button onClick={handleLogout} colorScheme='red'>Logout</Button>
              </MenuItem>
            </MenuList>
          </Menu>
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={closeSettings}
            onSubmit={handleSettingsSubmit} // Ensure this function is provided
            submittedData={submittedData} // Pass the actual data to display in the table
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Header;