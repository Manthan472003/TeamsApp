import React, { useState, useEffect } from 'react';
import { Box, Button, useDisclosure, Heading, Stack } from '@chakra-ui/react';
import VersionManagementTable from './VersionManagementTable';
import AddVersionManagementEntryModal from './AddVersionManagementEntryModal';
import SearchFilter from './SearchFilter';
import { createNewVersionManagementEntry, getAllVersionManagementEntries } from '../Services/VersionManagementService';
import { getUsers } from '../Services/UserService';
import ExportToExcel from './ExportToExcel';
import ExportToPDF from './ExportToPdf';
import { IoMdAddCircleOutline } from "react-icons/io";

const VersionManagement = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [entries, setEntries] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [entriesResponse, usersResponse] = await Promise.all([
                    getAllVersionManagementEntries(),
                    getUsers(),
                ]);
                console.log('Fetched entries:', entriesResponse.data);
                console.log('Fetched users:', usersResponse.data);
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
            console.error('Error adding entry:', error);
        }
    };

    const sortedEntries = selectedUserId
        ? entries.filter(entry => String(entry.userId) === selectedUserId)
        : entries;

    const columns = [
        { key: 'technologyUsed', label: 'Technology Used' },
        { key: 'userId', label: 'Created By' },
        { key: 'currentVersion', label: 'Current Version' },
        { key: 'latestVersion', label: 'Latest Version' },
        { key: 'createdAt', label: 'Created At' }
    ];

    const enrichedEntries = sortedEntries.map(entry => ({
        ...entry,
        userId: users.find(user => user.id === entry.userId)?.userName || 'Unknown',
        createdAt: new Date(entry.createdAt).toLocaleDateString()
    }));

    return (
        <Box p={5}>
            <Heading as='h2' size='xl' paddingLeft={3} color={'#086F83'}>
                Version Management
            </Heading>
            <br />
            <Stack direction="row" width={1000} spacing={2} mt={3} mb={4}>
                <Button leftIcon={<IoMdAddCircleOutline size={23} />} onClick={onOpen} colorScheme='teal' variant='outline'>
                    Add Entry
                </Button>
            </Stack>

            <SearchFilter
                users={users}
                selectedUserId={selectedUserId}
                onUserChange={setSelectedUserId}
            />
            <Stack direction="row" spacing={2} mt={3} mb={4}>
                <ExportToExcel reports={sortedEntries} />
                <ExportToPDF
                    data={enrichedEntries}
                    columns={columns}
                    fileName="version_management_reports.pdf"
                    header="Version Status - Backend" 

                />                
                </Stack>

            <AddVersionManagementEntryModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={handleSave}
            />
            <VersionManagementTable
                entries={sortedEntries}
                users={users}
            />
        </Box>
    );
};

export default VersionManagement;