import React, { useState, useEffect } from 'react';
import { Select, useToast } from '@chakra-ui/react';
import { getUsers } from '../Services/UserService'; // Adjust import path as necessary

const UserDropdown = ({ selectedUser, onUserSelect }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toast({
                    title: "Error fetching users",
                    description: "Unable to load users. Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchUsers();
    }, [toast]);

    if (loading) return <Select placeholder="Loading..." isDisabled />;

    return (
        <Select
            placeholder="Select a user"
            value={selectedUser || ""}
            onChange={(e) => onUserSelect(e.target.value)}
        >
            {users.map(user => (
                <option key={user.id} value={user.id}>
                    {user.userName || 'Unnamed User'}
                </option>
            ))}
        </Select>
    );
};

export default UserDropdown;
