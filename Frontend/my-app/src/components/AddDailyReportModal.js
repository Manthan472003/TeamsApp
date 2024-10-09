import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Select, useToast
} from '@chakra-ui/react';
import jwt_decode from 'jwt-decode';
import { getAssignedTasks } from '../Services/TaskService';

const AddDailyReportModal = ({ isOpen, onClose, onSubmit, userId: propUserId }) => {
  const [taskId, setTaskId] = useState(''); // New state for task ID
  const [taskName, setTaskName] = useState(''); // Optional: Use to display task name
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState(propUserId || '');
  const [assignedTasks, setAssignedTasks] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (propUserId) {
      setUserId(propUserId);
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwt_decode(token);
          setUserId(decodedToken.id);
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      } else {
        console.error('No token found in local storage');
      }
    }
  }, [propUserId]);

  useEffect(() => {
    if (userId) {
      const fetchAssignedTasks = async () => {
        try {
          const response = await getAssignedTasks(userId);
          const filteredTasks = response.data.filter(
            (task) => task.status !== 'Completed' && task.isDelete === false
          );
          setAssignedTasks(filteredTasks);
        } catch (error) {
          console.error('Error fetching assigned tasks:', error);
        }
      };
      fetchAssignedTasks();
    }
  }, [userId]);

  const resetForm = () => {
    setTaskId(''); // Reset taskId
    setTaskName(''); // Optional: Reset taskName
    setStatus('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if taskName is empty
    if (!taskName) {
      toast({
        title: "Task Name is required.",
        description: "Please enter a task name before submitting.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return; // Exit the function if taskName is empty
    }
  
    // If taskId is null, don't include it in the report object
    const report = {
      userId: parseInt(userId, 10),
      taskId: parseInt(taskId, 10), // This will be null if no task is selected
      taskName, // Send task name as well
      status,
    };
  
    if (typeof onSubmit === 'function') {
      try {
        // Omit taskId if it is null
        await onSubmit(report);
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

          {/* Dropdown for Assigned Tasks */}
          <FormControl id="assignedTasks" mb={4}>
            <FormLabel>My Assigned Tasks</FormLabel>
            <Select
              placeholder="Select a task"
              onChange={(e) => {
                const selectedValue = e.target.value;
                const selectedTask = assignedTasks.find(task => task.id === selectedValue);

                setTaskId(selectedValue === '' ? null : parseInt(selectedValue, 10));
                setTaskName(selectedTask ? selectedTask.taskName : ''); // Optionally set task name for display
              }}
            >
              {assignedTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.taskName}
                </option>
              ))}
            </Select>
          </FormControl>


          {/* Task Name Input (Optional, if you want to display task name) */}
          <FormControl id="taskname" mb={4}>
            <FormLabel>Task Name</FormLabel>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
            />
          </FormControl>



          {/* Status Dropdown */}
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