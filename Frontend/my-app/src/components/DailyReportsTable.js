import React from 'react';

const DailyReportsTable = ({ reports, users }) => {
    const getUserNameById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const colorPalette = [
        "#ffddd6", // Light Red
        "#d0f5d7", // Light Green
        "#dee4ff", // Light Blue
        "#fadcec", // Light Pink
        "#fff1d4", // Light Yellow
        "#d4fffc", // Light Cyan
        "#feffd4", // Light Mint
        "#edd4ff", // Light Lavender
        "#ffe5e5", // Light Coral
        "#e5ffe5", // Light Lime
        "#e5e5ff", // Light Periwinkle
        "#fff5e5", // Light Peach
        "#e5f5ff", // Light Sky Blue
        "#f5e5ff", // Light Amethyst
        "#f5ffe5", // Light Honeydew
        "#ffe5f7", // Light Blush
        "#e5f7ff", // Light Ice Blue
    ];

    const dateColorMap = {};

    const sortedReports = reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Assign colors based on createdAt date using the color palette
    const coloredReports = sortedReports.map(report => {
        const createdAtDate = new Date(report.createdAt).toDateString();

        if (!dateColorMap[createdAtDate]) {
            const colorIndex = Object.keys(dateColorMap).length % colorPalette.length; // Cycle through colors
            dateColorMap[createdAtDate] = colorPalette[colorIndex]; // Assign color from palette
        }

        return {
            ...report,
            color: dateColorMap[createdAtDate],
        };
    });

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
                {coloredReports.length > 0 ? (
                    coloredReports.map((report) => (
                        <tr
                            key={report.id}
                            style={{
                                backgroundColor: report.color // Use the assigned color
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