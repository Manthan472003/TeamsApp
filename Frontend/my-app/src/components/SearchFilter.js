import React from 'react';
import { Select } from '@chakra-ui/react';

const SearchFilter = ({ users, selectedUserId, onUserChange }) => {
    return (
        <Select 
            placeholder="Select By User"
            value={selectedUserId} 
            onChange={(e) => onUserChange(e.target.value)}
            width="200px"
            marginBottom={4}
        >
            {users.map(user => (
                <option key={user.id} value={user.id}>
                    {user.userName}
                </option>
            ))}
        </Select>
    );
};

export default SearchFilter;