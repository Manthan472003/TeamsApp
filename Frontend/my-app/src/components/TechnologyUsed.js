// screen/TechnologyUsed.js
import React, { useState } from 'react';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import SettingsModal from '../components/SettingModal';

const TechnologyUsed = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [submittedData, setSubmittedData] = useState([]);

    const handleSave = (data) => {
        // Update submitted data with new configuration
        setSubmittedData((prevData) => [...prevData, data]);
        onClose(); // Close the modal after saving
    };

    return (

        <Box p={5}>
            <Button onClick={onOpen} colorScheme='teal' variant='outline' mt={3} mb={4}>
                Technology Configuration            </Button>

            <SettingsModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={handleSave}
                submittedData={submittedData}
            />
        </Box>
    );
};

export default TechnologyUsed;
