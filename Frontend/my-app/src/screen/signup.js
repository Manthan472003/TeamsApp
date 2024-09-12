import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Heading, Input, Button, InputGroup, Stack, InputLeftElement, chakra, Box, Link, Image, FormControl, FormHelperText, InputRightElement } from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { saveUser } from '../Services/UserService'; // Import the saveUser function
import logo from '../assets/logo.png';


const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleToggle = () => navigate('/login');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = { userName: username, email, password };
      await saveUser(user);
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error.response ? error.response.data : error.message);
      alert('Signup failed. Please check your inputs or try again later.');
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100vw"
      height="100vh"
      backgroundColor="#E6FFFA"
      justifyContent="center"
      alignItems="center"
    >
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
      <Image
          src={logo}
          alt="OrganizeIt Logo"
          boxSize="65px"
        />
        <Heading color="teal.400">Organize-It !!</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" boxShadow="md">
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<CFaUserAlt color="gray.300" />} />
                  <Input type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<CFaUserAlt color="gray.300" />} />
                  <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300" children={<CFaLock color="gray.300" />} />
                  <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link>Forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button borderRadius={0} type="submit" variant="solid" colorScheme="teal" width="full">
                Signup
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        Already have an account?{' '}
        <Button colorScheme="teal" variant="link" onClick={handleToggle}>
          LOGIN
        </Button>
      </Box>
    </Flex>
  );
};

export default Signup;