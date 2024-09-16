import React, { useState, useEffect } from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import AddDailyReportModal from './AddDailyReportModal';
import { createDailyReport, getAllReports } from '../Services/DailyReportsService';
import { getUsers } from '../Services/UserService';
import DailyReportsTable from './DailyReportsTable';
import ExportToExcel from './ExportToExcel';
import ExportToPDF from './ExportToPdf';
import FilterComponent from './FilterComponent';

const DailyReports = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState({ type: '', startDate: null, endDate: null });

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
            setReports(response.data);
            onClose();
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const applyFilters = (reports) => {
        let filteredReports = [...reports];

        if (filter.type === 'dateRange') {
            if (filter.startDate && filter.endDate) {
                filteredReports = filteredReports.filter(report => {
                    const reportDate = new Date(report.createdAt);
                    return reportDate >= new Date(filter.startDate) && reportDate <= new Date(filter.endDate);
                });
            }
        } else if (filter.type === 'day') {
            if (filter.startDate) {
                filteredReports = filteredReports.filter(report => {
                    const reportDate = new Date(report.createdAt);
                    return reportDate.toDateString() === new Date(filter.startDate).toDateString();
                });
            }
        } else if (filter.type === 'month') {
            if (filter.startDate) {
                const filterMonth = new Date(filter.startDate).getMonth();
                const filterYear = new Date(filter.startDate).getFullYear();
                filteredReports = filteredReports.filter(report => {
                    const reportDate = new Date(report.createdAt);
                    return reportDate.getMonth() === filterMonth && reportDate.getFullYear() === filterYear;
                });
            }
        }

        return filteredReports;
    };

    const filteredReports = applyFilters(reports);

    return (
        <Box p={5}>
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
            <FilterComponent filter={filter} onFilterChange={handleFilterChange} />
            <Box mb={4}>
                <ExportToExcel reports={filteredReports} />
                <ExportToPDF reports={filteredReports} users={users} />
                </Box>
            <DailyReportsTable reports={filteredReports} users={users} />
        </Box>
    );
};

export default DailyReports;