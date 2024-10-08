import React, { useEffect, useState } from 'react';

const colorPalette = [
    "#ffddd6", // Light peach
    "#d0f5d7", // Soft mint green
    "#dee4ff", // Light lavender
    "#fadcec", // Pale rose
    "#fff1d4", // Light cream
    "#d4fffc", // Pale turquoise
    "#feffd4", // Light lemon yellow
    "#edd4ff"  // Soft lavender
];

const VersionManagementTable = ({ entries, users }) => {
    const [userColors, setUserColors] = useState({});

    const getUserNameById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const getRandomColor = (excludeColors) => {
        const availableColors = colorPalette.filter(color => !excludeColors.includes(color));
        return availableColors[Math.floor(Math.random() * availableColors.length)];
    };

    useEffect(() => {
        const colors = {};
        users.forEach(user => {
            colors[user.id] = getRandomColor([]); // Initially assign a random color to each user
        });
        setUserColors(colors);
    }, [users]);

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
                    sortedEntries.map((entry, index) => {
                        const currentUserColor = userColors[entry.userId];
                        const previousEntryUser = index > 0 ? sortedEntries[index - 1].userId : null;
                        const previousRowColor = index > 0 ? userColors[sortedEntries[index - 1].userId] : null;

                        // Determine the row color
                        let rowColor = currentUserColor;
                        if (entry.userId !== previousEntryUser && rowColor === previousRowColor) {
                            rowColor = getRandomColor([previousRowColor]); // Get a new color if it's the same as the previous row's color
                            userColors[entry.userId] = rowColor; // Update the color for the current user
                        }

                        return (
                            <tr
                                key={entry.id}
                                style={{
                                    backgroundColor: rowColor
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
                        );
                    })
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
