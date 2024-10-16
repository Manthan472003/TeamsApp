import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Button,
} from '@chakra-ui/react';

const AddBuildModal = ({ isOpen, onClose, onSubmit, taskToEdit }) => {
    const [newTask, setNewTask] = useState({
        applicationName: '',
        deployedOn: '',
        versionManagement: '',
        media: '',
        sectionID: null,
    });

    useEffect(() => {
        if (taskToEdit) {
            setNewTask(taskToEdit);
        } else {
            setNewTask({ applicationName: '', deployedOn: '', versionManagement: '', media: '', sectionID: null });
        }
    }, [taskToEdit]);

    const handleSubmit = () => {
        onSubmit(newTask);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{taskToEdit ? "Edit Task" : "Add Task"}</ModalHeader>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Application Name</FormLabel>
                        <Input
                            value={newTask.applicationName}
                            onChange={(e) => setNewTask({ ...newTask, applicationName: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Deployed On</FormLabel>
                        <Input
                            type="date"
                            value={newTask.deployedOn}
                            onChange={(e) => setNewTask({ ...newTask, deployedOn: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Version Management</FormLabel>
                        <Input
                            value={newTask.versionManagement}
                            onChange={(e) => setNewTask({ ...newTask, versionManagement: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Media</FormLabel>
                        <Input
                            value={newTask.media}
                            onChange={(e) => setNewTask({ ...newTask, media: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Section ID</FormLabel>
                        <Input
                            type="number"
                            value={newTask.sectionID || ''}
                            onChange={(e) => setNewTask({ ...newTask, sectionID: e.target.value ? parseInt(e.target.value, 10) : null })}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddBuildModal;