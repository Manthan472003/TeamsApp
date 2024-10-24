import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';

const ViewLinkModal = ({ isOpen, onClose, link }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>View Media Link</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="lg" mb={4}>
            Media Link:
          </Text>
          <Text>
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              {link}
            </a>
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewLinkModal;