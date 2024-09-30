import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, useToast, Heading } from '@chakra-ui/react';
import { getSections, deleteSection } from '../Services/SectionService';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { DeleteIcon } from '@chakra-ui/icons'; // Import the DeleteIcon

const Sections = () => {
    const [sections, setSections] = useState([]);
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    const toast = useToast();

    // Fetch sections from backend wrapped in useCallback
    const fetchSections = useCallback(async () => {
        try {
            const response = await getSections();
            setSections(response.data); // Assuming response.data is the array of sections
        } catch (error) {
            toast({
                title: "Error fetching sections",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]); // Include toast in the dependency array

    // Delete section
    const handleDeleteSection = async (id) => {
        try {
            await deleteSection(id);
            setSections((prevSections) => prevSections.filter(section => section.id !== id)); // Update state
            toast({
                title: "Section deleted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error deleting section",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleOpenConfirmDelete = (id) => {
        setSectionToDelete(id);
        setConfirmDeleteOpen(true);
    };

    useEffect(() => {
        fetchSections();
    }, [fetchSections]); // No warning here since fetchSections is stable

    return (
        <Box p={5}>
            <Heading as='h2' size='xl' paddingLeft={3} mb={4}
                sx={{
                    background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                }}>
                Section List
            </Heading>
            <Table variant="simple" borderRadius="xl" overflow="hidden">
                <Thead bg="gray.100" >
                    <Tr>
                        <Th color="gray.700" width="40%" fontWeight={800} fontSize={15} >Section Name</Th>
                        <Th color="gray.700" width="40%" fontWeight={800} fontSize={15}>Created At</Th>
                        <Th color="gray.700" width="20%" fontWeight={800} fontSize={15}>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody  >
                    {sections.map(section => (
                        <Tr key={section.id} style={{ backgroundColor: section.id % 2 === 0 ? '#ebfff0' : '#d7f2ff' }}>
                            <Td>{section.sectionName}</Td>
                            <Td>
                                {new Intl.DateTimeFormat('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }).format(new Date(section.createdAt))}
                            </Td>
                            <Td>
                                <Button colorScheme="red" onClick={() => handleOpenConfirmDelete(section.id)}>
                                    <DeleteIcon boxSize={5} mr={2} />
                                    Delete
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>


            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={() => {
                    handleDeleteSection(sectionToDelete);
                    setConfirmDeleteOpen(false); // Close modal after confirming
                }}
                itemName={sectionToDelete ? sections.find(s => s.id === sectionToDelete)?.sectionName : ''}
            />
        </Box>
    );
};

export default Sections;