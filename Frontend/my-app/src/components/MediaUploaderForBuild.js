import React, { useState } from 'react';
import { Box, Button, Input, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { IoMdCloudUpload } from "react-icons/io";
import { createMedia, getMediaOfTheTaskorBuild } from '../Services/MediaService';
import ViewImageModal from './ViewImageModal';
import ViewVideoModal from './ViewVideoModal';

const MediaUploaderForBuild = ({ buildId }) => {
    const [mediaFile, setMediaFile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [mediaLink, setMediaLink] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
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
            fetchMedia();
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

    const fetchMedia = async () => {
        try {
            const response = await getMediaOfTheTaskorBuild('Build', buildId);
            setMediaLink(response.data.mediaLink);
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
    };

    const handleMediaView = () => {
        const isImage = mediaLink && (mediaLink.endsWith('.jpg') || mediaLink.endsWith('.png'));
        const isVideo = mediaLink && mediaLink.endsWith('.mp4');

        if (isImage) {
            setIsImageModalOpen(true);
        } else if (isVideo) {
            setIsVideoModalOpen(true);
        }
    };

    return (
        <Box>
            <Button
                leftIcon={<IoMdCloudUpload size={20} />}
                colorScheme="teal"
                onClick={() => setIsOpen(true)}
            >
                Upload Media
            </Button>

            {mediaLink && (
                <Button ml={3} colorScheme="blue" onClick={handleMediaView}>
                    View Media
                </Button>
            )}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload Media</ModalHeader>
                    <ModalBody>
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

            {mediaLink && (
                <>
                    <ViewImageModal
                        isOpen={isImageModalOpen}
                        onClose={() => setIsImageModalOpen(false)}
                        imageSrc={mediaLink}
                    />
                    <ViewVideoModal
                        isOpen={isVideoModalOpen}
                        onClose={() => setIsVideoModalOpen(false)}
                        videoSrc={mediaLink}
                    />
                </>
            )}
        </Box>
    );
};

export default MediaUploaderForBuild;