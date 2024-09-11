import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input } from '@chakra-ui/react';

const EditSectionModal = ({ isOpen, onClose, section, onSectionUpdated }) => {
    const [sectionName, setSectionName] = useState('');
    const [loading, setLoading] = useState(false); // Add a loading state

    useEffect(() => {
        if (section) {
            setSectionName(section.sectionName);
        }
    }, [section]);

    const handleUpdateSection = async () => {
        setLoading(true); // Set loading state before making API call
        try {
            // Create an updated section object
            const updatedSection = { ...section, sectionName };
            await onSectionUpdated(updatedSection); // Wait for the update to complete
            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error('Error updating section:', error);
            // Optionally, you can show an error message here
        } finally {
            setLoading(false); // Reset loading state regardless of success or failure
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Section</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        placeholder="Section Name"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme='blue'
                        onClick={handleUpdateSection}
                        isLoading={loading} // Show loading spinner while updating
                    >
                        Update
                    </Button>
                    <Button variant='outline' ml={3} onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditSectionModal;
