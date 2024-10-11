import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import {
  ChakraProvider,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Textarea,
  HStack,
  useToast,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { getUser, updateUser, getUsers } from '../Services/UserService';
import ChangePasswordModal from './ChangePasswordModal'; // Import the modal

const Profile = () => {
  const [user, setUser] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    userType: '',
    workingAs: '',
  });
  const [originalUser, setOriginalUser] = useState(null);
  const [, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  let userId;

  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwt_decode(token);
    userId = decoded.id;
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const response = await getUser(userId);
        setUser(response.data);
        setOriginalUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({ title: "Error fetching user data", status: "error", duration: 3000 });
      } finally {
        setLoading(false);
      }
    };

    const fetchUserTypes = async () => {
      try {
        const response = await getUsers();
        const types = response.data.map(user => user.userType);
        setUserTypes([...new Set(types)]);
      } catch (error) {
        console.error("Error fetching user types:", error);
        toast({ title: "Error fetching user types", status: "error", duration: 3000 });
      }
    };

    fetchUser();
    fetchUserTypes();
  }, [toast, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));

    if (name === 'phoneNumber') {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
      }
    } else {
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFields = {};
    if (user.userName !== originalUser.userName) updatedFields.userName = user.userName;
    if (user.email !== originalUser.email) updatedFields.email = user.email;
    if (user.phoneNumber !== originalUser.phoneNumber) updatedFields.phoneNumber = user.phoneNumber;
    if (user.bio !== originalUser.bio) updatedFields.bio = user.bio;
    if (user.userType !== originalUser.userType) updatedFields.userType = user.userType;
    if (user.workingAs !== originalUser.workingAs) updatedFields.workingAs = user.workingAs;

    try {
      await updateUser(userId, updatedFields);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      toast({
        title: "Error Updating Profile",
        description: "There was an error updating your profile.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={4} as='h2' size='xl' paddingLeft={3}
          sx={{
            background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block',
          }}>
          User Profile
        </Heading>

        <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit} paddingLeft={4}>
          <FormControl>
            <FormLabel htmlFor="userName"><b>Full Name</b></FormLabel>
            <Input
              id="userName"
              name="userName"
              value={user.userName}
              placeholder="Enter your Name here"
              onChange={handleChange}
            />
          </FormControl>

          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel htmlFor="email"><b>Email</b></FormLabel>
              <Input
                type="email"
                id="email"
                name="email"
                value={user.email}
                placeholder="Enter your mail here"
                onChange={handleChange}
                readOnly
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="phoneNumber"><b>Phone Number</b></FormLabel>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={user.phoneNumber}
                placeholder="Enter 10-digit phone number"
                onChange={handleChange}
                maxLength={10}
                pattern="\d{10}"
                title="Please enter a valid 10-digit phone number"
                required
              />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel htmlFor="userType"><b>User Type</b></FormLabel>
              <Input value={user.userType || ''} readOnly />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="workingAs"><b>Work As</b></FormLabel>
              <Input
                id="workingAs"
                name="workingAs"
                value={user.workingAs}
                placeholder="Add your Role"
                onChange={handleChange}
              />
            </FormControl>
          </SimpleGrid>

          <FormControl>
            <FormLabel htmlFor="bio"><b>Bio</b></FormLabel>
            <Textarea
              id="bio"
              name="bio"
              value={user.bio}
              placeholder="Tell us about yourself..."
              onChange={handleChange}
            />
          </FormControl>

          <HStack spacing={4} mt={4}>
            <Button colorScheme="blue" type="submit">
              Save Changes
            </Button>
            <Button colorScheme="gray" variant="outline" onClick={() => setUser(originalUser)}>
              Cancel
            </Button>

            <Button
              colorScheme="red"
              mt={4}
              position="absolute"
              right="20px"
              onClick={() => setIsModalOpen(true)}
            >
              Change Password
            </Button>
          </HStack>
        </VStack>

        {/* Change Password Modal */}
        <ChangePasswordModal userId={userId} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </Box>
    </ChakraProvider>
  );
};

export default Profile;