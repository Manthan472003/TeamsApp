import React, { useEffect, useState, useCallback } from 'react';
import { useDisclosure, Box, Heading, Button, useToast, Stack, Card, CardBody } from '@chakra-ui/react';
import { createBuildEntry, fetchAllBuildEntries } from '../Services/BuildService';
import AddBuildModal from './AddBuildModal';
import { IoMdAddCircleOutline } from "react-icons/io";
import BuildEntryTable from './BuildEntryTable';
import { getSections } from '../Services/SectionService';

const BuildDashboard = () => {
    const toast = useToast();
    const { isOpen: isAddTaskOpen, onOpen: onAddTaskOpen, onClose: onAddTaskClose } = useDisclosure();
    const [buildEntries, setBuildEntries] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);

    const handleEntrySubmit = async (data) => {
        try {
            await createBuildEntry(data);
            fetchBuildEntries();
            onAddTaskClose();
            setSelectedTaskIds([]); // Clear selected tasks after submission
            toast({
                title: "Build Entry Created",
                description: "The build entry has been successfully created.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error adding entry:', error);
            toast({
                title: "Error creating build entry.",
                description: "There was a problem creating the build entry. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const fetchBuildEntries = useCallback(async () => {
        try {
            const response = await fetchAllBuildEntries();
            if (Array.isArray(response.data)) {
                setBuildEntries(response.data);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching build entries:', error);
            toast({
                title: "Error fetching build entries.",
                description: "There was a problem fetching the build entries. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]);

    const fetchSections = useCallback(async () => {
        try {
            const response = await getSections();
            if (Array.isArray(response.data)) {
                setSections(response.data);
            } else {
                throw new Error('Unexpected sections response format');
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
            toast({
                title: "Error fetching sections.",
                description: "There was a problem fetching the sections. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]);

    useEffect(() => {
        fetchBuildEntries();
        fetchSections();
    }, [fetchBuildEntries, fetchSections]);

    return (
        <Box mt={5}>
            <Heading as='h2' size='xl' paddingLeft={3}
                sx={{
                    background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                }}>
                Build Dashboard
            </Heading>
            <br />

            <Button
                leftIcon={<IoMdAddCircleOutline size={23} />}
                onClick={onAddTaskOpen}
                colorScheme='blue' variant='outline' mt={3} mb={4}>
                Add Builds
            </Button>
            <AddBuildModal
                isOpen={isAddTaskOpen}
                onClose={onAddTaskClose}
                onSubmit={(data) => {
                    handleEntrySubmit(data);
                    setSelectedTaskIds(data.selectedTasks); // Set selected tasks after submission
                }}
            />

            <Stack spacing={4}>
                {buildEntries.map((build, index) => (
                    <Card key={index} variant="outline">
                        <CardBody>
                            <BuildEntryTable
                                build={build}
                                sections={sections}
                                selectedTasks={selectedTaskIds} // Pass selected tasks to the table
                            />
                        </CardBody>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
};

export default BuildDashboard;