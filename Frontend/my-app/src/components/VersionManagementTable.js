import React from 'react';

const VersionManagementTable = ({ entries, users }) => {

    const getUserNameById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden', marginTop: '16px', tableLayout: 'fixed' }}>
            <thead style={{ backgroundColor: '#f7fafc' }}>
                <tr>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Technology Used</th>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Created By</th>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Current Version</th>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Latest Version</th>
                    <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Created At</th>
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
                            <td style={{ padding: '10px' }}>{entry.technologyUsed}</td>
                            <td style={{ padding: '10px' }}>{getUserNameById(entry.userId)}</td>
                            <td style={{ padding: '10px' }}>{entry.currentVersion}</td>
                            <td style={{ padding: '10px' }}>{entry.latestVersion}</td>
                            <td style={{ padding: '10px' }}>
                                {new Intl.DateTimeFormat('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }).format(new Date(entry.createdAt))}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: '#a0aec0', padding: '10px' }}>
                            No tasks available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

    );
};

export default VersionManagementTable;
