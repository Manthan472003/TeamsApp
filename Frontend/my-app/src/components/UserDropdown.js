import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';
import { getUsers } from '../Services/UserService'; // Adjust import path as necessary

const UserDropdown = ({ selectedUser, onUserSelect }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <Select placeholder="Loading..."></Select>;
    if (error) return <Select placeholder={error}></Select>;

    return (
        <Select
            placeholder="Select a user"
            value={selectedUser}
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
