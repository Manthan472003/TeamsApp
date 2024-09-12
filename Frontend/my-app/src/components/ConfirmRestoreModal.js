// src/components/ConfirmRestoreModal.js

import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text } from '@chakra-ui/react';

const ConfirmRestoreModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Restore</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Are you sure you want to restore the task "{itemName}"?</Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant='outline' mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='blue' onClick={onConfirm}>
                        Confirm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmRestoreModal;
