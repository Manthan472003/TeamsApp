import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Heading, Input, Button, InputGroup, Stack, InputLeftElement, chakra, Box, Link, Image, FormControl, FormHelperText, InputRightElement, Text } from '@chakra-ui/react';
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { saveUser } from '../Services/UserService';
import { sendEmail } from '../Services/MailService';
import { PacmanLoader } from 'react-spinners';
import logo from '../assets/logo.png';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleToggle = () => navigate('/login');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Show loader

    try {
      const user = { userName: username, email, password };
      await saveUser(user);

      const emailContent = {
        email: email,
        subject: "Welcome to Copious Teams!",
        text: "Thank you for signing up!",
        html: '<h1>Welcome!</h1><p>Thank you for signing up. We are glad to have you as our Team Member !!</p>',
      };

      await sendEmail(emailContent);

      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error.response ? error.response.data : error.message);
      alert('Signup failed. Please check your inputs or try again later.');
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100vw"
      height="100vh"
      backgroundColor="#e8f0fd"
      justifyContent="center"
      alignItems="center"
    >
      {loading ? (
        <Flex direction="column" align="center">
          <PacmanLoader size={40} color="#319795" /> {/* Increased size */}
          <br />
          <Text mt={4} fontSize="xl" color="blue.500">Hang tight! We're getting things ready for you...</Text> {/* Wait message */}
        </Flex>
      ) : (
        <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
          <Image
            src={logo}
            alt="Copious Logo"
            width="50%"
            height="130px"
          />
          <Heading color="blue.400">Copious-Teams !!!</Heading>
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
                      <Button h="1.75rem" size="sm" onClick={handleShowClick} backgroundColor={'#ffffff'}>
                      {showPassword ? <FaEyeSlash size={22}/> : <FaEye size={22}/>}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {/* <FormHelperText textAlign="right">
                    <Link>Forgot password?</Link>
                  </FormHelperText> */}
                </FormControl>
                <Button borderRadius={0} type="submit" variant="solid" colorScheme="blue" width="full">
                  Signup
                </Button>
              </Stack>
            </form>
          </Box>
          <Box>
            Already have an account?{' '}
            <Button colorScheme="blue" variant="link" onClick={handleToggle}>
              LOGIN
            </Button>
          </Box>
        </Stack>
      )}
    </Flex>
  );
};

export default Signup;
