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
        appId: '',
        deployedOn: '',
        versionName: '',
        mediaLink: '',
    });

    useEffect(() => {
        if (taskToEdit) {
            setNewTask(taskToEdit);
        } else {
            setNewTask({ appId: '', deployedOn: '', versionName: '', mediaLink: '' });
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
                <ModalHeader>{taskToEdit ? "Edit Build" : "Add Build"}</ModalHeader>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Application ID</FormLabel>
                        <Input
                            value={newTask.appId}
                            onChange={(e) => setNewTask({ ...newTask, appId: e.target.value })}
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
                        <FormLabel>Version Name</FormLabel>
                        <Input
                            value={newTask.versionName}
                            onChange={(e) => setNewTask({ ...newTask, versionName: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Media Link</FormLabel>
                        <Input
                            value={newTask.mediaLink}
                            onChange={(e) => setNewTask({ ...newTask, mediaLink: e.target.value })}
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