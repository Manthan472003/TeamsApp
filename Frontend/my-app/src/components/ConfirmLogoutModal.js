// ConfirmDeleteModal.js
import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Logout</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Are you sure you want to logout?
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onConfirm}>
                        Logout
                    </Button>
                    <Button variant='ghost' onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmLogoutModal;