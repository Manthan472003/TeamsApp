// ConfirmDeleteModal.js
import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Deletion</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Are you sure you want to delete {itemName}? This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onConfirm}>
                        Delete
                    </Button>
                    <Button variant='ghost' onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmDeleteModal;
