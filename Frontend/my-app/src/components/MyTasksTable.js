import React, { useState, useEffect } from 'react';
import { getTags } from '../Services/TagService'; // Adjust import according to your file structure
import { getSections } from '../Services/SectionService'; // Assuming you have a service to fetch sections

const MyTasksTable = ({ tasks, users }) => {
    const [tags, setTags] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getTags();
                setTags(response.data); // Assuming response.data contains the array of tags
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        const fetchSections = async () => {
            try {
                const response = await getSections();
                setSections(response.data); // Assuming response.data contains the array of sections
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        };

        fetchTags();
        fetchSections();
    }, []);


    const getTagNamesByIds = (tagIds) => {
        const tagMap = new Map(tags.map(tag => [tag.id, tag.tagName]));

        return tagIds.map(id => {
            const tagName = tagMap.get(id);
            if (!tagName) {
                console.error(`No tag found for ID: ${id}`);
                return 'Unknown';
            }
            return tagName;
        });
    };

    const getSectionNameById = (sectionId) => {
        const section = sections.find(sec => sec.id === sectionId);
        return section ? section.sectionName : 'No Section';
    };

    const sortedTasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return (
        <>
            <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden', marginTop: '16px', tableLayout: 'fixed' }}>
                <thead style={{ backgroundColor: '#f7fafc' }}>
                    <tr>
                        <th style={{ width: '48%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Task Name</th>
                        <th style={{ width: '17%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left', whiteSpace: 'normal' }}>Tags</th>
                        <th style={{ width: '15%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Due Date</th>
                        <th style={{ width: '20%', color: '#4a5568', fontWeight: 800, fontSize: '15px', padding: '10px', textAlign: 'left' }}>Section</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTasks.length > 0 ? (
                        sortedTasks.map((task, index) => (
                            <tr
                                key={task.id}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#ebfff0' : '#d7f2ff'
                                }}
                            >
                                <td style={{ padding: '10px' }}>{task.taskName}</td>
                                <td style={{ padding: '10px', whiteSpace: 'normal', overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {getTagNamesByIds(task.tagIDs || []).map((tagName, idx) => (
                                            <span key={idx} style={{
                                                display: 'inline-block',
                                                backgroundColor: '#48bb78',
                                                color: 'white',
                                                borderRadius: '6px',
                                                padding: '4px 8px',
                                                margin: '2px'
                                            }}>
                                                {tagName}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }).format(new Date(task.dueDate))}
                                </td>
                                <td style={{ padding: '10px' }}>{task.sectionID ? getSectionNameById(task.sectionID) : 'No Section'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: '#a0aec0', padding: '10px' }}>
                                No tasks available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </>
    );
}

export default MyTasksTable;
