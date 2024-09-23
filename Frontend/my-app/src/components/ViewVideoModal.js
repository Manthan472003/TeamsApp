import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Box,
} from '@chakra-ui/react';

const ViewVideoModal = ({ isOpen, onClose, videoSrc }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>View Video</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            as="video"
            controls
            width="100%"
            height="100%"
            objectFit="contain"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </Box>
        </ModalBody>
        <Button colorScheme="blue" onClick={onClose}>Close</Button>
      </ModalContent>
    </Modal>
  );
};

export default ViewVideoModal;
