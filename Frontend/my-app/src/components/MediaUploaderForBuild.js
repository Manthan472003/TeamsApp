import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Input, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { IoMdCloudUpload } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { createMedia, getMediaOfTheTaskorBuild } from '../Services/MediaService';
import ViewImageModal from './ViewImageModal';
import ViewVideoModal from './ViewVideoModal';

const MediaUploaderForBuild = ({ buildId }) => {
    const [mediaFile, setMediaFile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [mediaLinks, setMediaLinks] = useState([]);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [selectedMediaLink, setSelectedMediaLink] = useState(null);
    const toast = useToast();

    const fetchMedia = useCallback(async () => {
        try {
            const response = await getMediaOfTheTaskorBuild('Build', buildId);
            setMediaLinks(response.data);
        } catch (error) {
            console.error('Error fetching media:', error);
            toast({
                title: "Error fetching media.",
                description: String(error.response ? error.response.data.message : error.message),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [buildId, toast]);

    useEffect(() => {
        fetchMedia(); 
    }, [fetchMedia]);

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
            await createMedia('Build', buildId, [mediaFile]);
            toast({
                title: "Media uploaded.",
                description: `You have uploaded media for build ID "${buildId}".`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setMediaFile(null);
            setIsOpen(false);
            fetchMedia(); // Fetch updated media after upload
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

    const handleMediaView = (link) => {
        const isImage = link && (link.endsWith('.jpg') || link.endsWith('.png') || link.endsWith('.jpeg'));
        const isVideo = link && link.endsWith('.mp4');

        setSelectedMediaLink(link);
        if (isImage) {
            setIsImageModalOpen(true);
        } else if (isVideo) {
            setIsVideoModalOpen(true);
        }
    };

    const handlePaste = (event) => {
        event.preventDefault(); // Prevent default paste behavior
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (file) {
                    setMediaFile(file);
                }
            }
        }
    };

    return (
        <Box>
            <Button
                leftIcon={<IoMdCloudUpload size={20} />}
                colorScheme="teal"
                onClick={() => setIsOpen(true)}
            >
            </Button>

            {mediaLinks.length > 0 && (
                mediaLinks.map((media, index) => (
                    <Button
                        key={index}
                        leftIcon={<FaEye size={20} />}
                        ml={2}
                        colorScheme="blue"
                        onClick={() => handleMediaView(media.mediaLink)}
                    />
                ))
            )}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload Media</ModalHeader>
                    <ModalBody onPaste={handlePaste}>
                        <Input
                            type="file"
                            accept="image/*, video/*"
                            onChange={(e) => setMediaFile(e.target.files[0])}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleMediaUpload} isDisabled={!mediaFile}>
                            Upload
                        </Button>
                        <Button ml={3} onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {selectedMediaLink && (
                <>
                    <ViewImageModal
                        isOpen={isImageModalOpen}
                        onClose={() => setIsImageModalOpen(false)}
                        imageSrc={selectedMediaLink}
                    />
                    <ViewVideoModal
                        isOpen={isVideoModalOpen}
                        onClose={() => setIsVideoModalOpen(false)}
                        videoSrc={selectedMediaLink}
                    />
                </>
            )}
        </Box>
    );
};

export default MediaUploaderForBuild;
