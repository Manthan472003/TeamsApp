import React from 'react';
const DailyReportsTable = ({ reports, users }) => {
    const getUserNameById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };


    const sortedReports = reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden' }}>
            <thead style={{ backgroundColor: '#f7fafc' }}>
                <tr>
                    <th style={{ width: '25%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Task</th>
                    <th style={{ width: '25%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Created By</th>
                    <th style={{ width: '25%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Status</th>
                    <th style={{ width: '25%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Created At</th>
                </tr>
            </thead>
            <tbody>
                {sortedReports.length > 0 ? (
                    sortedReports.map((report, index) => (
                        <tr
                            key={report.id}
                            style={{
                                backgroundColor: index % 2 === 0 ? '#ebfff0' : '#d7f2ff'
                            }}
                        >
                            <td style={{ padding: '10px' }}>{report.taskName}</td>
                            <td style={{ padding: '10px' }}>{getUserNameById(report.userId)}</td>
                            <td style={{ padding: '10px' }}>{report.status}</td>
                            <td style={{ padding: '10px' }}>
                                {new Intl.DateTimeFormat('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }).format(new Date(report.createdAt))}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#a0aec0', padding: '10px' }}>
                            No reports available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>



    );
};

export default DailyReportsTable;
