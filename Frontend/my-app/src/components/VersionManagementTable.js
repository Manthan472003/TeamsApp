import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const VersionManagementTable = ({ entries, users }) => {

    const getUserNameById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <Table variant='striped' mt={4} style={{ tableLayout: 'fixed' }}>
            <Thead>
                <Tr>
                    <Th width='20%'>Technology Used</Th>
                    <Th width='20%'>Created By</Th>
                    <Th width='20%'>Current Version</Th>
                    <Th width='20%'>Latest Version</Th>
                    <Th width='20%'>Created At</Th>
                </Tr>
            </Thead>
            <Tbody>
                {sortedEntries.length > 0 ? (
                    sortedEntries.map((entry, index) => (
                        <Tr
                            key={entry.id}
                            style={{
                                backgroundColor: index % 2 === 0 ? '#f9e79f' : '#d7f2ff'
                            }}
                        >
                            <Td>{entry.technologyUsed}</Td>
                            <Td>{getUserNameById(entry.userId)}</Td>
                            <Td>{entry.currentVersion}</Td>
                            <Td>{entry.latestVersion}</Td>
                            <Td>{formatDate(entry.createdAt)}</Td>
                        </Tr>
                    ))
                ) : (
                    <Tr>
                        <Td colSpan={5} textAlign="center" color="gray.500">
                            No tasks available
                        </Td>
                    </Tr>
                )}
            </Tbody>
        </Table>
    );
};

export default VersionManagementTable;
