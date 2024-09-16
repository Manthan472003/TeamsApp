import React, { useState, useEffect } from 'react';
import { Box, Button, Heading} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import AddDailyReportModal from './AddDailyReportModal';
import {createDailyReport, getAllReports } from '../Services/DailyReportsService';
import { getUsers } from '../Services/UserService';
import DailyReportsTable from './DailyReportsTable';

const DailyReports = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);


    const fetchReports = async () => {
        try {
            const [reportsResponse, usersResponse] = await Promise.all([
                getAllReports(),
                getUsers(),
            ]);
            setReports(reportsResponse.data);
            setUsers(usersResponse.data);
        } catch (error) {
            console.error('Error fetching daily reports:', error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleSave = async (data) => {
        try {
            await createDailyReport(data);
            const response = await getAllReports();
            console.log('Fetched reports:', response.data); // Add this line
            setReports(response.data);
            onClose();
        } catch (error) {
            console.error('Error adding entry : ', error);
        }
    };
    

    return (

        <Box mt={5}>
            <Heading as='h2' size='xl' paddingLeft={3} color={'#086F83'}>
                Daily Reports
            </Heading>
            <br />
            <Button onClick={onOpen} colorScheme='teal' variant='outline' mt={3} mb={4}>
                Add Daily Report
            </Button>
            <AddDailyReportModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={handleSave}
            />
            <DailyReportsTable
            reports={reports}
            users={users}
            />
        </Box>
    );
};

export default DailyReports;
