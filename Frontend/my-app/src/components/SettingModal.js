import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
} from '@chakra-ui/react';

const SettingsModal = ({ isOpen, onClose, onSubmit, submittedData = [] }) => {
    const [technologyName, setTechnologyName] = useState('');
    const [currtechVersion, setCurrTechVersion] = useState('');
    const [latesttechVersion, setLatesttechVersion] = useState('');
    const [createdat, setCreatedat] = useState('');

    const toast = useToast();

    const handleSubmit = () => {
        // Create an object with the form data
        const formData = {
            technologyName,
            currtechVersion,
            latesttechVersion,
            createdat
        };

        // Pass the form data to the onSubmit handler
        if (typeof onSubmit === 'function') {
            onSubmit(formData);
        } else {
            console.error('onSubmit is not a function');
        }

        // Optionally show a toast notification
        toast({
            title: "Configurations Saved.",
            description: "Your configuration have been saved.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });

        // Clear form fields
        setTechnologyName('');
        setCurrTechVersion('');
        setLatesttechVersion('');
        setCreatedat('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="technology" mb={4}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            value={technologyName}
                            onChange={(e) => setTechnologyName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="techVersion" mb={4}>
                        <FormLabel>Current Version</FormLabel>
                        <Input
                            value={currtechVersion}
                            onChange={(e) => setCurrTechVersion(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="system" mb={4}>
                        <FormLabel>Latest Version</FormLabel>
                        <Input
                            value={latesttechVersion}
                            onChange={(e) => setLatesttechVersion(e.target.value)}
                        />
                    </FormControl>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>

                    {/* Table to show submitted data */}
                    <Table variant="simple" colorScheme="teal" mt={6}>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Current Version</Th>
                                <Th>Latest Version</Th>
                                <Th>Created at</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {Array.isArray(submittedData) && submittedData.length > 0 ? (
                                submittedData.map((item, index) => (
                                    <Tr key={index}>
                                        <Td>{item.technologyName}</Td>
                                        <Td>{item.currtechVersion}</Td>
                                        <Td>{item.latesttechVersion}</Td>
                                        <Td>{item.createdat}</Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan="4">No data available</Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SettingsModal;