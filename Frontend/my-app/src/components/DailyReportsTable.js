import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const DailyReportsTable = ({ reports, users }) => {
    const getUserNameById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    const sortedReports = reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <Table variant='striped' mt={4} style={{ tableLayout: 'fixed' }}>
            <Thead>
                <Tr>
                    <Th width='25%'>Task</Th>
                    <Th width='25%'>Created By</Th>
                    <Th width='25%'>Status</Th>
                    <Th width='25%'>Created At</Th>
                </Tr>
            </Thead>
            <Tbody>
                {sortedReports.length > 0 ? (
                    sortedReports.map((report, index) => (
                        <Tr
                            key={report.id}
                            style={{
                                backgroundColor: index % 2 === 0 ? '#f9e79f' : '#d7f2ff'
                            }}
                        >
                            <Td>{report.taskName}</Td>
                            <Td>{getUserNameById(report.userId)}</Td>
                            <Td>{report.status}</Td>
                            <Td>{formatDate(report.createdAt)}</Td>
                        </Tr>
                    ))
                ) : (
                    <Tr>
                        <Td colSpan={4} textAlign="center" color="gray.500">
                            No reports available
                        </Td>
                    </Tr>
                )}
            </Tbody>
        </Table>
    );
};

export default DailyReportsTable;
