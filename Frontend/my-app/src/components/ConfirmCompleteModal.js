// ConfirmCompleteModal.js
import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';

const ConfirmCompleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Completion</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Are you sure you want to mark {itemName} as completed? This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='green' mr={3} onClick={onConfirm}>
                        Complete
                    </Button>
                    <Button variant='ghost' onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmCompleteModal;
