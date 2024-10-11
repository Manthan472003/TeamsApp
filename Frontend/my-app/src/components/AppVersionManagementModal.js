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
    Select,
    useToast,
} from '@chakra-ui/react';
import jwt_decode from 'jwt-decode';

const AppVersionManagementModal = ({ isOpen, onClose, onSubmit, userId: propUserId }) => {
    const [applicationName, setApplicationName] = useState('');
    const [liveVersion, setLiveVersion] = useState('');
    const [testVersion, setTestVersion] = useState('');
    const [status, setStatus] = useState('Not Started');
    const [userId, setUserId] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (propUserId) {
            setUserId(propUserId);
        } else {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwt_decode(token);
                    setUserId(decodedToken.id);
                } catch (error) {
                    console.error('Failed to decode token:', error);
                }
            } else {
                console.error('No token found in local storage');
            }
        }
    }, [propUserId]);

    const resetForm = () => {
        setApplicationName('');
        setLiveVersion('');
        setTestVersion('');
        setStatus('Not Started');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const entry = {
            userId: parseInt(userId, 10),
            applicationName,
            liveVersion,
            testVersion,
            status,
        };

        if (typeof onSubmit === 'function') {
            try {
                await onSubmit(entry);
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
                    <FormControl id="applicationName" mb={4}>
                        <FormLabel>Application Name</FormLabel>
                        <Input
                            value={applicationName}
                            onChange={(e) => setApplicationName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="liveVersion" mb={4}>
                        <FormLabel>Live Version</FormLabel>
                        <Input
                            value={liveVersion}
                            onChange={(e) => setLiveVersion(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="testVersion" mb={4}>
                        <FormLabel>Test Version</FormLabel>
                        <Input
                            value={testVersion}
                            onChange={(e) => setTestVersion(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="status" mb={4}>
                        <FormLabel>Status</FormLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Working On">Working On</option   >
                            <option value="Submitted">Submitted</option>
                            <option value="In Review">In Review</option>
                        </Select>
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

export default AppVersionManagementModal;