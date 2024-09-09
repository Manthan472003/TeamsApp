import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Heading, Input, Button, InputGroup, Stack, InputLeftElement, chakra, Box, Link, Avatar, FormControl, FormHelperText, InputRightElement, Text } from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import axios from 'axios';

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

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
  
    try {
      const response = await axios.post('http://localhost:8080/users/login', { email, password });
  
      // Assuming the backend returns a success message
      if (response.status === 200) {
        navigate('/home');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Incorrect email or password');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };
  

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="#E6FFFA"
      justifyContent="center"
      alignItems="center"
    >
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Avatar bg="teal.500" />
        <Heading color="teal.400">TEAMS APP</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <form onSubmit={handleLogin}>
            <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" boxShadow="md">
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<CFaUserAlt color="gray.300" />} />
                  <Input
                    type="email"
                    placeholder="email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isRequired
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300" children={<CFaLock color="gray.300" />} />
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
                <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText>
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
