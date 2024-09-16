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

const AddVersionManagementEntryModal = ({ isOpen, onClose, onSubmit, userId : propUserId }) => {
    const [technologyUsed, setTechnologyUsed] = useState('');
    const [currentVersion, setCurrentVersion] = useState('');
    const [latestVersion, setLatestVersion] = useState('');
    const [userId, setUserId] = useState(propUserId || '');

    const toast = useToast();

useEffect(()=> {
        // Check if userId is available from props or local storage
        if (!propUserId) {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
            } else {
                console.error('No user ID found in local storage');
            }
        } else {
            setUserId(propUserId);
        }
    }, [propUserId]);

    const resetForm = () => {
        setTechnologyUsed('');
        setCurrentVersion('');
        setLatestVersion('');
    };


const handleSubmit = async(event) => {

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
          await onSubmit(entry); // Call onSubmit instead of createDailyReport directly
          toast({
            title: "New Entry Saved.",
            description: "Your Entry has been saved.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          resetForm();
          onClose();
        } catch (error) {
          console.error("Error adding Entry : ", error);
          toast({
            title: "Error adding Entry.",
            description: error.response?.data?.message || "An error occurred while adding the entry.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        console.error('onSubmit is not a function');
      }


    // Clear form fields
    setTechnologyUsed('');
    setCurrentVersion('');
    setLatestVersion('');
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