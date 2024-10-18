import React, { useEffect, useState } from 'react';
import { getSections } from '../Services/SectionService';
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
    Select,
    FormErrorMessage
} from '@chakra-ui/react';

const AddBuildModal = ({ isOpen, onClose, onSubmit, taskToEdit }) => {
    const [appId, setAppId] = useState('');
    const [deployedOn, setDeployedOn] = useState('');
    const [versionName, setVersionName] = useState('');
    const [mediaLink, setMediaLink] = useState('');
    const [sections, setSections] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await getSections();
                if (response && response.data) {
                    setSections(response.data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        };
        fetchSections();
    }, []);

    useEffect(() => {
        if (taskToEdit) {
            setAppId(taskToEdit.appId || '');
            setDeployedOn(taskToEdit.deployedOn || '');
            setVersionName(taskToEdit.versionName || '');
            setMediaLink(taskToEdit.mediaLink || '');
        } else {
            resetFields();
        }
    }, [taskToEdit]);

    const resetFields = () => {
        setAppId('');
        setDeployedOn('');
        setVersionName('');
        setMediaLink('');
        setErrors({});
    };

    const validateFields = () => {
        const newErrors = {};
        if (!appId) newErrors.appId = "Application is required.";
        if (!deployedOn) newErrors.deployedOn = "Deployed On is required.";
        if (!versionName) newErrors.versionName = "Version Name is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = () => {
        if (validateFields()) {
            const newTask = {
                appId,
                deployedOn,
                versionName,
                mediaLink,
            };
            onSubmit(newTask);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{taskToEdit ? "Edit Build" : "Add Build"}</ModalHeader>
                <ModalBody>
                    <FormControl mb={4} isInvalid={!!errors.appId}>
                        <FormLabel>Application</FormLabel>
                        <Select
                            value={appId}
                            onChange={(e) => setAppId(e.target.value)}
                        >
                            <option value="">Select Application</option>
                            {sections.map(section => (
                                <option key={section.id} value={section.id}>
                                    {section.sectionName}
                                </option>
                            ))}
                        </Select>
                        <FormErrorMessage>{errors.appId}</FormErrorMessage>
                    </FormControl>
                    <FormControl mt={4} isInvalid={!!errors.deployedOn}>
                        <FormLabel>Deployed On</FormLabel>
                        <Select
                            value={deployedOn}
                            onChange={(e) => setDeployedOn(e.target.value)}
                        >
                            <option value="">Select Environment</option>
                            <option value="Production">Production</option>
                            <option value="Stage">Stage</option>
                        </Select>
                        <FormErrorMessage>{errors.deployedOn}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!errors.versionName}>
                        <FormLabel>Version Name</FormLabel>
                        <Input
                            value={versionName}
                            onChange={(e) => setVersionName(e.target.value)}
                        />
                        <FormErrorMessage>{errors.versionName}</FormErrorMessage>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Media Link</FormLabel>
                        <Input
                            value={mediaLink}
                            onChange={(e) => setMediaLink(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={() => {
                        handleSubmit();
                        resetFields();                    
                    }}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={() => {
                        resetFields();
                        onClose();
                    }}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddBuildModal;
