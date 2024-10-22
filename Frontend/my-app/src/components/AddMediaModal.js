import React, { useState, useRef } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Stack,
    Text,
    Image,
    Box,
    IconButton,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { createMedia } from '../Services/MediaService';
import { AiFillFileAdd } from "react-icons/ai";


const AddMediaModal = ({ isOpen, onClose, taskId, onUploadComplete }) => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null); // Ref for file input

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setMediaFiles(files);
        setShowPreview(true); // Show preview after selecting files
    };

    const confirmUpload = async () => {
        const formData = new FormData();
        mediaFiles.forEach((file) => {
            formData.append('mediaFiles', file);
        });
        formData.append('taskId', taskId);

        if (mediaFiles.length === 0) {
            alert('No files selected');
            return;
        }

        setLoading(true); // Start loading

        try {
            await createMedia('Task',taskId, formData);
            onUploadComplete(); // Trigger the parent to refresh media
            onClose(); // Close modal after upload
        } catch (error) {
            console.error('Failed to upload media:', error);
            alert('Failed to upload media. Please try again.');
        } finally {
            // Clear files on successful upload
            setMediaFiles([]);
            setShowPreview(false);
            setLoading(false); // End loading
        }
    };

    const handleClose = () => {
        // Clear files when modal is closed
        setMediaFiles([]);
        setShowPreview(false);
        onClose();
    };

    const handleDeleteFile = (index) => {
        setMediaFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Media Files</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Button
                        onClick={() => fileInputRef.current.click()}
                        colorScheme="blue"
                        mb={4}
                        leftIcon={<AiFillFileAdd />}
                    >
                        Choose Files
                    </Button>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }} // Hide the input
                    />
                    {showPreview && !loading && (
                        <Stack mt={4}>
                            <Text fontWeight="bold">Selected Files:</Text>
                            <Stack spacing={2}>
                                {mediaFiles.map((file, index) => (
                                    <Box key={index} border="1px" borderColor="gray.200" borderRadius="md" p={2}>
                                        <Text>{file.name}</Text>
                                        {file.type.startsWith('image/') && (
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt={`preview-${file.name}`}
                                                boxSize="100px"
                                                objectFit="cover"
                                                borderRadius="md"
                                            />
                                        )}
                                        {file.type.startsWith('video/') && (
                                            <video
                                                src={URL.createObjectURL(file)}
                                                controls
                                                style={{ width: '100%', borderRadius: 'md' }}
                                            />
                                        )}
                                        <IconButton
                                            aria-label="Delete file"
                                            icon={<FaTrash />}
                                            colorScheme="red"
                                            size="sm"
                                            mt={2}
                                            onClick={() => handleDeleteFile(index)}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={confirmUpload} isLoading={loading}>
                        {loading ? 'Uploading...' : 'Confirm Upload'}
                    </Button>
                    <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddMediaModal;
