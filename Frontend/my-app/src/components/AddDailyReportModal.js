import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Select, useToast
} from '@chakra-ui/react';

const AddDailyReportModal = ({ isOpen, onClose, onSubmit, userId: propUserId }) => {
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState(propUserId || '');
  const toast = useToast();

  useEffect(() => {
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
    setTaskName('');
    setStatus('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const report = {
      userId: parseInt(userId, 10),
      taskName,
      status,
    };

    if (typeof onSubmit === 'function') {
      try {
        await onSubmit(report); // Call onSubmit instead of createDailyReport directly
        toast({
          title: "New Report Saved.",
          description: "Your Report has been saved.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        resetForm();
        onClose();
      } catch (error) {
        console.error("Error adding Report : ", error);
        toast({
          title: "Error adding report.",
          description: error.response?.data?.message || "An error occurred while adding the report.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      console.error('onSubmit is not a function');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Daily Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="taskname" mb={4}>
            <FormLabel>Task</FormLabel>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </FormControl>
          <FormControl id="status" mb={4}>
            <FormLabel>Status</FormLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Select status"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Research">Research</option>
              <option value="On Hold">On Hold</option>
            </Select>
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

export default AddDailyReportModal;
