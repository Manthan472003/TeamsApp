import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, HStack, Tag, TagLabel } from '@chakra-ui/react';
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

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
            <Table variant='striped' mt={4} style={{ tableLayout: 'fixed' }}>
                <Thead>
                    <Tr>
                        <Th width='48%'>Task Name</Th>
                        <Th width='17%' style={{ whiteSpace: 'normal' }}>Tags</Th>
                        <Th width='15%'>Due Date</Th>
                        <Th width='20%'>Section</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedTasks.length > 0 ? (
                        sortedTasks.map((task, index) => (
                            <Tr
                                key={task.id}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#f9e79f' : '#d7f2ff'
                                }}
                            >
                                <Td>{task.taskName}</Td>
                                <Td style={{ whiteSpace: 'normal', overflow: 'hidden' }}>
                                    <HStack spacing={2} style={{ flexWrap: 'wrap' }}>
                                        {getTagNamesByIds(task.tagIDs || []).map((tagName, idx) => (
                                            <Tag
                                                size='md'
                                                key={idx}
                                                borderRadius='6px'
                                                variant='solid'
                                                colorScheme='green'
                                            >
                                                <TagLabel>{tagName}</TagLabel>
                                            </Tag>
                                        ))}
                                    </HStack>
                                </Td>
                                <Td>{formatDate(task.dueDate)}</Td>
                                <Td>{task.sectionID ? getSectionNameById(task.sectionID) : 'No Section'}</Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={6} textAlign="center" color="gray.500">
                                No tasks available
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </>
    );
}

export default MyTasksTable;
