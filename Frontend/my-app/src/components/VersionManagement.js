// screen/TechnologyUsed.js
import React, { useState, useEffect } from 'react';
import { Box, Button, useDisclosure, Heading } from '@chakra-ui/react';
import VersionManagementTable from './VersionManagementTable';
import AddVersionManagementEntryModal from './AddVersionManagementEntryModal';
import { createNewVersionManagementEntry, getAllVersionManagementEntries } from '../Services/VersionManagementService';
import { getUsers } from '../Services/UserService';

const VersionManagement = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [entries, setEntries] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [entriesResponse, usersResponse] = await Promise.all([
                    getAllVersionManagementEntries(),
                    getUsers(),
                ]);
                setEntries(entriesResponse.data);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSave = async (data) => {
        try {
            await createNewVersionManagementEntry(data);
            const response = await getAllVersionManagementEntries();
            setEntries(response.data);
            onClose();
        } catch (error) {
            console.error('Error adding entry : ', error);
        }
    };


    return (

        <Box p={5}>
            <Heading as='h2' size='xl' paddingLeft={3} color={'#086F83'}>
                Version Management
            </Heading>
            <br />
            <Button onClick={onOpen} colorScheme='teal' variant='outline' mt={3} mb={4}>
                Add Entry
            </Button>

            <AddVersionManagementEntryModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={handleSave}
            />
            <VersionManagementTable
                entries={entries}
                users={users}
            />
        </Box>
    );
};

export default VersionManagement;
