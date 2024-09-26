import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Heading, Input, Button, InputGroup, Stack, InputLeftElement, InputRightElement, chakra, Box, Image, FormControl, Text } from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { loginUser } from '../Services/UserService'; // Import the loginUser function
import logo from '../assets/logo.png';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleToggle = () => navigate('/signup');

  const validateForm = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) && password.length >= 6;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please enter a valid email and a password with at least 6 characters.');
      return;
    }

    try {
      const response = await loginUser(email, password); // Use the loginUser function from UserService

      if (response.status === 200) {
        const { token } = response.data; // Assume token is returned in response

        // Store user information from the token
        localStorage.setItem('token', token); // Store the token

        navigate('/home'); // Navigate to home after successful login
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError('Incorrect email or password');
            break;
          case 401:
            setError('Unauthorized');
            break;
          default:
            setError('An error occurred. Please try again later.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  // Clear local storage when the component mounts
  useEffect(() => {
    localStorage.clear(); // Clear local storage
  }, []);

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100vh"
      backgroundColor="#E6FFFA"
      justifyContent="center"
      alignItems="center"
      p={{ base: 4, md: 8 }}
    >
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Image
          src={logo}
          alt="Copious Logo"
          width="50%"
          height="130px"
        />
        <Heading color="teal.400">Copious !!</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <form onSubmit={handleLogin}>
            <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" boxShadow="md">
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" aria-label="Email Icon" children={<CFaUserAlt color="gray.300" />} />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isRequired
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" aria-label="Password Icon" color="gray.300" children={<CFaLock color="gray.300" />} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isRequired
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              {error && <Text color="red.500">{error}</Text>}
              <Button borderRadius={0} type="submit" variant="solid" colorScheme="teal" width="full">
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{' '}
        <Button colorScheme="teal" variant="link" onClick={handleToggle}>
          SIGNUP
        </Button>
      </Box>
    </Flex>
  );
};

export default Login;
