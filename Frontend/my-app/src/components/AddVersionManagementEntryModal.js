import React, { useState } from 'react';
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

const AddVersionManagementEntryModal = ({ isOpen, onClose, onSubmit }) => {
    const [technologyName, setTechnologyName] = useState('');
    const [currtechVersion, setCurrTechVersion] = useState('');
    const [latesttechVersion, setLatesttechVersion] = useState('');

    const toast = useToast();

    const handleSubmit = () => {
        // Create an object with the form data
        const formData = {
            technologyName,
            currtechVersion,
            latesttechVersion,
        };

        // Pass the form data to the onSubmit handler
        if (typeof onSubmit === 'function') {
            onSubmit(formData);
        } else {
            console.error('onSubmit is not a function');
        }

        // Optionally show a toast notification
        toast({
            title: "Configurations Saved.",
            description: "Your configuration has been saved.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });

        // Clear form fields
        setTechnologyName('');
        setCurrTechVersion('');
        setLatesttechVersion('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="technology" mb={4}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            value={technologyName}
                            onChange={(e) => setTechnologyName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="techVersion" mb={4}>
                        <FormLabel>Current Version</FormLabel>
                        <Input
                            value={currtechVersion}
                            onChange={(e) => setCurrTechVersion(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="latestVersion" mb={4}>
                        <FormLabel>Latest Version</FormLabel>
                        <Input
                            value={latesttechVersion}
                            onChange={(e) => setLatesttechVersion(e.target.value)}
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