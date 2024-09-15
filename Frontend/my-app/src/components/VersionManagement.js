// screen/TechnologyUsed.js
import React, { useState } from 'react';
import { Box, Button, useDisclosure, Heading} from '@chakra-ui/react';
import SettingsModal from './AddVersionManagementEntryModal';
import VersionManagementTable from './VersionManagementTable';

const VersionManagement = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [submittedData, setSubmittedData] = useState([]);

    const handleSave = (data) => {
        // Update submitted data with new configuration
        setSubmittedData((prevData) => [...prevData, data]);
        onClose(); // Close the modal after saving
    };

    return (

        <Box p={5}>
            <Heading as='h2' size='xl' paddingLeft={3} color={'#086F83'}>
                Completed Tasks
            </Heading>
            <br />
            <Button onClick={onOpen} colorScheme='teal' variant='outline' mt={3} mb={4}>
                Version Management
            </Button>

            <SettingsModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={handleSave}
                submittedData={submittedData}
            />
            <VersionManagementTable/>
        </Box>
    );
};

export default VersionManagement;
