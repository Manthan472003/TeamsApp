// src/App.js
import React, { useEffect, useState } from 'react';
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
  Select,
  HStack,
  Image,
  useToast,
} from '@chakra-ui/react';
import { getUser, updateUser, getUsers } from '../Services/UserService';

const Profile = ({ userId }) => {
  const [image, setImage] = useState(null);
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    userType: '',
    jobTitle: '',
  });
  const [userTypes, setUserTypes] = useState([]);
  const toast = useToast();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(userId);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserTypes = async () => {
      try {
        const response = await getUsers();
        const types = response.data.map(user => user.userType);
        setUserTypes([...new Set(types)]); // Get unique user types
      } catch (error) {
        console.error("Error fetching user types:", error);
      }
    };

    fetchUser();
    fetchUserTypes();
  }, [userId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userId, { userType: user.userType });
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

  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={5}>User Profile</Heading>
        <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
          
          {/* Profile Picture Section */}
          <FormControl>
            <FormLabel htmlFor="profilePic">Profile Picture</FormLabel>
            <HStack spacing={4}>
              <Image
                borderRadius="full"
                boxSize="100px"
                src={image || "https://via.placeholder.com/100"}
                alt="Profile Picture"
              />
              <Input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleImageChange}
              />
            </HStack>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="fullName">User Name</FormLabel>
            <Input
              id="fullName"
              name="fullName"
              value={user.fullName}
              placeholder="Enter your Name here"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              value={user.email}
              placeholder="Enter your mail here"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="phone">Phone Number</FormLabel>
            <Input
              id="phone"
              name="phone"
              value={user.phone}
              placeholder="+91-0000000000"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="bio">Bio</FormLabel>
            <Textarea
              id="bio"
              name="bio"
              value={user.bio}
              placeholder="Tell us about yourself..."
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="userType">User Type</FormLabel>
            <Select
              id="userType"
              name="userType"
              value={user.userType}
              onChange={handleChange}
            >
              {userTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="jobTitle">Work As</FormLabel>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={user.jobTitle}
              placeholder="Software Engineer"
              onChange={handleChange}
            />
          </FormControl>

          <HStack spacing={4} mt={4}>
            <Button colorScheme="blue" type="submit">
              Save Changes
            </Button>
            <Button colorScheme="gray" variant="outline">
              Cancel
            </Button>
          </HStack>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default Profile;