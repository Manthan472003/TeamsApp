import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Select, useToast
} from '@chakra-ui/react';
import { createDailyReport } from '../Services/DailyReportsService';

const AddDailyReportModal = ({ isOpen, onClose }) => {
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const toast = useToast();

  const handleSubmit = async () => {
    if (!taskName || !status) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true); // Start loading

    try {
      await createDailyReport({ taskName, status });
      toast({
        title: "Report Added",
        description: "The daily report was successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Reset form fields
      setTaskName('');
      setStatus('');
      onClose(); 
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add the daily report.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Daily Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Task</FormLabel>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task details"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Select status"
            >
              <option value="working on">Working On</option>
              <option value="completed">Completed</option>
              <option value="research">Research</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading} // Show loading spinner
          >
            Submit
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddDailyReportModal;