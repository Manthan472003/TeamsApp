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
    Button,
    useToast,
} from '@chakra-ui/react';
import jwt_decode from 'jwt-decode'; // Import jwt-decode

const AddVersionManagementEntryModal = ({ isOpen, onClose, onSubmit, userId: propUserId }) => {
    const [technologyUsed, setTechnologyUsed] = useState('');
    const [currentVersion, setCurrentVersion] = useState('');
    const [latestVersion, setLatestVersion] = useState('');
    const [userId, setUserId] = useState('');

    const toast = useToast();

    useEffect(() => {
        // Check if userId is available from props or token
        if (propUserId) {
            setUserId(propUserId);
        } else {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwt_decode(token);
                    setUserId(decodedToken.id); // Adjust according to your token structure
                } catch (error) {
                    console.error('Failed to decode token:', error);
                }
            } else {
                console.error('No token found in local storage');
            }
        }
    }, [propUserId]);

    const resetForm = () => {
        setTechnologyUsed('');
        setCurrentVersion('');
        setLatestVersion('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Create an object with the form data
        const entry = {
            userId: parseInt(userId, 10),
            technologyUsed,
            currentVersion,
            latestVersion,
        };

        if (typeof onSubmit === 'function') {
            try {
                await onSubmit(entry); // Call onSubmit with the entry
                toast({
                    title: "New Entry Saved.",
                    description: "Your entry has been saved.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                resetForm();
                onClose();
            } catch (error) {
                console.error("Error adding entry:", error);
                toast({
                    title: "Error adding entry.",
                    description: error.response?.data?.message || "An error occurred while adding the entry.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } else {
            console.error('onSubmit is not a function');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add New Entry</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="technology" mb={4}>
                        <FormLabel>Technology Used</FormLabel>
                        <Input
                            value={technologyUsed}
                            onChange={(e) => setTechnologyUsed(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="techVersion" mb={4}>
                        <FormLabel>Current Version</FormLabel>
                        <Input
                            value={currentVersion}
                            onChange={(e) => setCurrentVersion(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="latestVersion" mb={4}>
                        <FormLabel>Latest Version</FormLabel>
                        <Input
                            value={latestVersion}
                            onChange={(e) => setLatestVersion(e.target.value)}
                        />
                    </FormControl>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddVersionManagementEntryModal;
