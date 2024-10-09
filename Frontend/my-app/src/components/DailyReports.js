import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Stack } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import AddDailyReportModal from './AddDailyReportModal';
import { createDailyReport, getAllReports } from '../Services/DailyReportsService';
import { getUsers } from '../Services/UserService';
import DailyReportsTable from './DailyReportsTable';
import ExportToExcel from './ExportToExcel';
import ExportToPDF from './ExportToPdf';
import FilterComponent from './FilterComponent';
import { IoMdAddCircleOutline } from "react-icons/io";
import { getTasks } from '../Services/TaskService';
 

const DailyReports = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState({ type: '', startDate: null, endDate: null });



const fetchReports = async () => {
    try {
        const [reportsResponse, usersResponse, tasksResponse] = await Promise.all([
            getAllReports(),
            getUsers(),
            getTasks()
        ]);
        setReports(reportsResponse.data);
        setUsers(usersResponse.data);
        setTasks(tasksResponse.data);

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
        console.log(data);
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

const columns = [
    { key: 'taskName', label: 'Task' },
    { key: 'taskId', label: 'Working On' },
    { key: 'userId', label: 'Created By' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created At' }
];

const getUserNameById = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.userName : 'Unknown';
};

const getTaskNameById = (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    return task ? task.taskName : '  ';
};

// Transform filtered reports to include user names for export
const exportData = filteredReports.map(report => ({
    ...report,
    userId: getUserNameById(report.userId), // Replace userId with userName
    taskId:  getTaskNameById(report.taskId), // Replace taskId with taskName
    createdAt: new Date(report.createdAt).toLocaleDateString() // Format date for export
}));

return (
    <Box p={5}>
        <Heading as='h2' size='xl' paddingLeft={3} sx={{
            background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block',
        }}>
            Daily Reports
        </Heading>
        <br />
        <Button
            leftIcon={<IoMdAddCircleOutline size={23} />}
            onClick={onOpen}
            colorScheme='teal' variant='outline' mt={3} mb={4}>
            Add Daily Report
        </Button>
        <AddDailyReportModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSave}
        />
        <FilterComponent filter={filter} onFilterChange={handleFilterChange} />
        <Box mb={4}>
            <Stack direction="row" spacing={2}>
                <ExportToExcel reports={filteredReports} />
                <ExportToPDF data={exportData} columns={columns} />
            </Stack>
        </Box>
        <DailyReportsTable reports={filteredReports} users={users} tasks={tasks} />
    </Box>
);
};

export default DailyReports;