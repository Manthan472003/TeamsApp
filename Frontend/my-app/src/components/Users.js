import React, { useEffect, useState } from 'react';
import { getUsers, updateUser } from '../Services/UserService';
import { Table, Tbody, Tr, Td, Th, Thead, Box, Select, useToast, Heading } from '@chakra-ui/react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const toast = useToast();

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserTypeChange = async (userId, newUserType) => {
        try {
            // Create a minimal update object
            const updatedUser = {
                userType: newUserType,
            };
    
            // Call the updateUser service with the minimal update
            const response = await updateUser(userId, updatedUser);
    
            if (response.status === 200) {
                // Update the local state immediately
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, userType: newUserType } : user
                ));
    
                toast({
                    title: "User Type Updated",
                    description: "The user type has been successfully updated.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user type:', error);
            toast({
                title: "Error Updating User Type",
                description: error.response?.data?.message || "There was an error updating the user type.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };
    



    // Define color mapping for each user type
    const userTypeColors = {
        Admin: '#d4fffc',         // Light turquoise
        Developer: '#fadcec',     // Pale rose
        FieldWorker: '#fff1d4',   // Light cream
        Doctor: '#edd4ff'         // Soft lavender
    };

    return (
        <Box p={5}>
            <Heading as='h2' size='xl' paddingLeft={3} mb={4}
                sx={{
                    background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                }}>
                User List
            </Heading>

            <Table variant="simple" borderRadius="xl" overflow="hidden">
                <Thead bg="gray.100">
                    <Tr>
                        <Th color="gray.700" width="30%" fontWeight={800} fontSize={15}>Name</Th>
                        <Th color="gray.700" width="30%" fontWeight={800} fontSize={15}>Email</Th>
                        <Th color="gray.700" width="20%" fontWeight={800} fontSize={15}>Created At</Th>
                        <Th color="gray.700" width="20%" fontWeight={800} fontSize={15}>User Type</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {users.map((user) => (
                        <Tr key={user.id} style={{ backgroundColor: userTypeColors[user.userType] || '#ffffff' }}>
                            <Td>{user.userName}</Td>
                            <Td>{user.email}</Td>
                            <Td>
                                {new Intl.DateTimeFormat('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }).format(new Date(user.createdAt))}
                            </Td>
                            <Td>
                                <Select
                                    bg="white"
                                    defaultValue={user.userType}
                                    onChange={(e) => handleUserTypeChange(user.id, e.target.value)}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Developer">Developer</option>
                                    <option value="FieldWorker">Field Worker</option>
                                    <option value="Doctor">Doctor</option>
                                </Select>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

        </Box>
    );
};

export default Users;
