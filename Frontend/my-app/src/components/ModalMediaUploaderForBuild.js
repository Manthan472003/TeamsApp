import React, { useState } from 'react';
import { Box, Button, Input, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { IoMdCloudUpload } from "react-icons/io";
import { createMedia } from '../Services/MediaService';

const ModalMediaUploaderForBuild = ({ buildId }) => {
    const [mediaFile, setMediaFile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const toast = useToast();

    const handleMediaUpload = async () => {
        if (!mediaFile) {
            toast({
                title: "No media file selected.",
                description: "Please select a media file to upload.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        try {
            console.log(`Uploading media for build ID: ${buildId}`, mediaFile);
            await createMedia('Build', buildId, [mediaFile]);
            toast({
                title: "Media uploaded.",
                description: `You have uploaded media for build ID "${buildId}".`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setMediaFile(null);
            setIsOpen(false); // Close modal after upload
        } catch (error) {
            console.error('Error uploading media:', error);
            toast({
                title: "Error uploading media.",
                description: String(error.response ? error.response.data.message : error.message),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                setMediaFile(file);
            }
        }
    };

    return (
        <Box>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload Media</ModalHeader>
                    <ModalBody>
                        <Input
                            type="file"
                            accept="image/*, video/*"
                            onChange={(e) => setMediaFile(e.target.files[0])}
                            onPaste={handlePaste}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button leftIcon={<IoMdCloudUpload size={20} />} colorScheme="teal" onClick={handleMediaUpload} isDisabled={!mediaFile}>
                            Upload
                        </Button>
                        <Button ml={3} onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ModalMediaUploaderForBuild;