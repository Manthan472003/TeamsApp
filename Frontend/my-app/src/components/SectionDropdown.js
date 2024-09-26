import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';
import { getSections } from '../Services/SectionService'; // Adjust import path as necessary

const SectionDropdown = ({ selectedSection, onSectionSelect }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getSections();
                setSections(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching sections');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <Select placeholder="Loading..."></Select>;
    if (error) return <Select placeholder={error}></Select>;

    return (
        <Select
            placeholder="Select a Section"
            value={selectedSection}
            onChange={(e) => onSectionSelect(e.target.value)}
        >
            {sections.map(section => (
                <option key={section.id} value={section.id}>
                    {section.sectionName || 'Unnamed Section'}
                </option>
            ))}
        </Select>
    );
};

export default SectionDropdown;
