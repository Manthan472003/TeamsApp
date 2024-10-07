import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    useToast,
    Spinner
} from '@chakra-ui/react';
import { getAppVersionManagementEntryByID, updateAppVersionManagementEntryByID } from '../Services/AppVersionManagementService';

const EditAppVersionManagementModal = ({ isOpen, onClose, entryId, onUpdate }) => {
    const [applicationName, setApplicationName] = useState('');
    const [liveVersion, setLiveVersion] = useState('');
    const [testVersion, setTestVersion] = useState('');
    const [status, setStatus] = useState('Not Started');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchEntryData = async () => {
            if (entryId) {
                setLoading(true);
                try {
                    const response = await getAppVersionManagementEntryByID(entryId);
                    const data = response.data;
                    setApplicationName(data.applicationName);
                    setLiveVersion(data.liveVersion);
                    setTestVersion(data.testVersion);
                    setStatus(data.status);
                } catch (error) {
                    console.error('Error fetching entry data:', error);
                    toast({
                        title: "Error fetching entry data.",
                        description: "Failed to load data.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                } finally {
                    setLoading(false);
                }
            }
        };

        if (isOpen) {
            fetchEntryData();
        }
    }, [isOpen, entryId, toast]);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const updatedEntry = {
            id: entryId,
            applicationName,
            liveVersion,
            testVersion,
            status,
        };
    
        try {
            await updateAppVersionManagementEntryByID(updatedEntry);
            onUpdate(updatedEntry); // Pass the correctly updated entry object
            toast({
                title: "Entry updated.",
                description: "The entry has been updated successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            console.error("Error updating entry:", error);
            toast({
                title: "Error updating entry.",
                description: error.response?.data?.message || "An error occurred while updating the entry.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };
    
    

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Entry</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loading ? (
                        <Spinner size="lg" />
                    ) : (
                        <>
                            <FormControl id="applicationName" mb={4}>
                                <FormLabel>Application Name</FormLabel>
                                <Input
                                    value={applicationName}
                                    onChange={(e) => setApplicationName(e.target.value)}
                                    required
                                />
                            </FormControl>
                            <FormControl id="liveVersion" mb={4}>
                                <FormLabel>Live Version</FormLabel>
                                <Input
                                    value={liveVersion}
                                    onChange={(e) => setLiveVersion(e.target.value)}
                                    required
                                />
                            </FormControl>
                            <FormControl id="testVersion" mb={4}>
                                <FormLabel>Test Version</FormLabel>
                                <Input
                                    value={testVersion}
                                    onChange={(e) => setTestVersion(e.target.value)}
                                    required
                                />
                            </FormControl>
                            <FormControl id="status" mb={4}>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="Working On">Working On</option>
                                    <option value="Submitted">Submitted</option>
                                    <option value="In Review">In Review</option>
                                </Select>
                            </FormControl>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Update
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditAppVersionManagementModal;