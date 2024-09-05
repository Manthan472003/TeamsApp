import React, { useRef, useState } from 'react';
import {
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, useToast
} from '@chakra-ui/react';
import { saveSection } from '../Services/SectionService';

const AddSectionModal = ({ isOpen, onClose, onSectionAdded }) => {
    const initialRef = useRef(null);
    const [sectionName, setSectionName] = useState('');
    const toast = useToast();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Trim whitespace from the section name
        const trimmedSectionName = sectionName.trim();

        if (!trimmedSectionName) {
            toast({
                title: "Validation Error",
                description: "Section name cannot be empty.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const sectionData = { SectionName: trimmedSectionName };
        console.log('Sending request with data:', sectionData);

        try {
            const response = await saveSection(sectionData);
            if (response.status === 201) {
                toast({
                    title: "Section Created",
                    description: "Your section has been created successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setSectionName(''); // Clear input field
                if (typeof onSectionAdded === 'function') {
                    onSectionAdded(); // Notify parent component
                }
                onClose(); // Close the modal
            } else {
                // Handle other unexpected status codes
                toast({
                    title: "An Error Occurred",
                    description: "Unable to create the section. Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Caught error:', error);
            const errorMessage = error.message.includes('409') 
                 ? 'This section already exists. Please choose a different name.' 
                 : 'There was an error connecting to the server. Please try again.';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "top-accent",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal
            initialFocusRef={initialRef}
            isOpen={isOpen}
            onClose={onClose}
            size="md"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Section</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <form onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel>Section Name</FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder='Enter Section Name'
                                value={sectionName}
                                onChange={(e) => setSectionName(e.target.value)}
                                aria-label="Section Name"
                            />
                        </FormControl>
                        <ModalFooter>
                            <Button type='submit' colorScheme='blue' mr={3}>
                                Save
                            </Button>
                            <Button onClick={onClose} variant='outline'>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddSectionModal;
