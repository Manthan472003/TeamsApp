import React from 'react';
import { FaEdit } from "react-icons/fa"; 
import { FcAcceptDatabase } from "react-icons/fc";
import { IconButton } from '@chakra-ui/react';

const VersionManagementTable = ({ entries, onEdit, onUpdate }) => {
    const sortedEntries = [...entries].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sorting by updatedAt

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden', marginTop: '16px', tableLayout: 'fixed' }}>
            <thead style={{ backgroundColor: '#f7fafc' }}>
                <tr>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Application</th>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Live Version</th>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Test Version</th>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Status</th>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Actions</th>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Updated At</th>
                </tr>
            </thead>
            <tbody>
                {sortedEntries.length > 0 ? (
                    sortedEntries.map((entry, index) => (
                        <tr
                            key={entry.id}
                            style={{
                                backgroundColor: index % 2 === 0 ? '#ebfff0' : '#d7f2ff'
                            }}
                        >
                            <td style={{ padding: '10px' }}>{entry.applicationName}</td>
                            <td style={{ padding: '10px' }}>{entry.liveVersion}</td>
                            <td style={{ padding: '10px' }}>{entry.testVersion}</td>
                            <td style={{ padding: '10px' }}>{entry.status}</td>
                            <td style={{ padding: '10px' }}>
                                <IconButton
                                    icon={<FaEdit size={20}/>}
                                    aria-label="Edit"
                                    title="Edit"
                                    onClick={() => onEdit(entry.id)}
                                    variant="outline"
                                    colorScheme="teal"
                                    mr={2}
                                />
                                <IconButton
                                    icon={<FcAcceptDatabase size={24} />}
                                    aria-label="Accept"
                                    title="Accept"
                                    onClick={() => onEdit(entry.id)}
                                    variant="outline"
                                    colorScheme="green"
                                />
                            </td>
                            <td style={{ padding: '10px' }}>
                                {new Intl.DateTimeFormat('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }).format(new Date(entry.updatedAt))}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: '#a0aec0', padding: '10px' }}>
                            No tasks available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default VersionManagementTable;