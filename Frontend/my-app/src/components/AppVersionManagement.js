import React, { useState, useEffect } from 'react';
import { Box, Button, useDisclosure, Heading, Stack } from '@chakra-ui/react';
import AppVersionManagementTable from './AppVersionManagementTable';
import AppVersionManagementModal from './AppVersionManagementModal';
import { createNewVersionManagementEntry, getAllVersionManagementEntries } from '../Services/VersionManagementService';
import { getUsers } from '../Services/UserService';
import ExportToExcel from './ExportToExcel';
import ExportToPDF from './ExportToPdf';
import { IoMdAddCircleOutline } from "react-icons/io";

const AppVersionManagement = () => {
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

    const columns = [
        { key: 'applicationName', label: 'Application Name' },
        { key: 'liveVersion', label: 'Live Version' },
        { key: 'testVersion', label: 'Test Version' },
        { key: 'status', label: 'Status' },
        { key: 'updatedAt', label: 'Updated At' }
    ];

    const enrichedEntries = entries.map(entry => ({
        ...entry,
        updatedAt: new Date(entry.updatedAt).toLocaleDateString(),
        userId: users.find(user => user.id === entry.userId)?.userName || 'Unknown'
    }));

    return (
        <Box p={5}>
            <Heading as='h2' size='xl' paddingLeft={3} 
                sx={{
                    background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                }}
            >
               App Version Management
            </Heading>
            <br />
            <Stack direction="row" width={1000} spacing={2} mt={3} mb={4}>
                <Button leftIcon={<IoMdAddCircleOutline size={23} />} onClick={onOpen} colorScheme='teal' variant='outline'>
                    Add Entry
                </Button>
            </Stack>

            <Stack direction="row" spacing={2} mt={3} mb={4}>
                <ExportToExcel reports={entries} />
                <ExportToPDF
                    data={enrichedEntries}
                    columns={columns}
                    fileName="version_management_reports.pdf"
                    header="Version Status - Backend" 
                />
            </Stack>

            <AppVersionManagementModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={handleSave}
            />
            <AppVersionManagementTable
                entries={enrichedEntries}
                users={users}
            />
        </Box>
    );
};

export default AppVersionManagement;
