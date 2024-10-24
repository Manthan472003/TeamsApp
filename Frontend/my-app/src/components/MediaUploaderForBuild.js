import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Input, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { IoMdCloudUpload } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { createMedia, getMediaOfTheTaskorBuild } from '../Services/MediaService';
import {  fetchAllBuildEntries, addAndroidLink } from '../Services/BuildService';
import ViewImageModal from './ViewImageModal';
import ViewVideoModal from './ViewVideoModal';
import ViewLinkModal from './ViewLinkModal';

const MediaUploaderForBuild = ({ buildId }) => {
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaLink, setMediaLink] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [mediaLinks, setMediaLinks] = useState([]);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [selectedMediaLink, setSelectedMediaLink] = useState(null);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const toast = useToast();

    const validateFile = (file) => {
        const maxFileSize = 5 * 1024 * 1024; // 5MB limit
        const validTypes = ['image/jpeg', 'image/png', 'video/mp4'];

        if (file.size > maxFileSize) {
            toast({
                title: "File too large.",
                description: "Please select a file smaller than 5MB.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        if (!validTypes.includes(file.type)) {
            toast({
                title: "Invalid file type.",
                description: "Only JPEG, PNG images, and MP4 videos are allowed.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        return true;
    };

    const fetchMedia = useCallback(async () => {
        try {
            const response = await getMediaOfTheTaskorBuild('Build', buildId);
            setMediaFiles(response.data || []); // Ensure we set an empty array if no data
        } catch (error) {
            console.error('Error fetching media files:', error);
            toast({
                title: "Error fetching media files.",
                description: String(error.response ? error.response.data.message : error.message),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [buildId, toast]);

    const fetchMediaLinks = useCallback(async () => {
        try {
            const response = await fetchAllBuildEntries();
            const buildEntriesWithLinks = response.data.filter(build => build.id === buildId && build.link);
            const links = buildEntriesWithLinks.map(entry => entry.link);
            setMediaLinks(links);
        } catch (error) {
            console.error('Error fetching media links:', error);
            toast({
                title: "Error fetching media links.",
                description: String(error.response ? error.response.data.message : error.message),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [buildId, toast]);

    useEffect(() => {
        if (buildId) {
            fetchMedia();
            fetchMediaLinks();
        }
    }, [fetchMedia, fetchMediaLinks, buildId]);

    const handleMediaUpload = async () => {
        if (!mediaFile && !mediaLink) {
            toast({
                title: "No media file or link provided.",
                description: "Please select a media file or enter a media link to upload.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            if (mediaFile) {
                if (!validateFile(mediaFile)) return;
                const mediaResponse = await createMedia('Build', buildId, [mediaFile]);
                console.log('Media upload response:', mediaResponse);

                if (mediaResponse.message !== 'Media created successfully.') {
                    throw new Error('Failed to upload media');
                }
            }

            if (mediaLink) {
                const linkResponse = await addAndroidLink(buildId, { link: mediaLink });
                console.log('Link upload response:', linkResponse);

                if (linkResponse.status !== 200) {
                    throw new Error('Failed to update build with link');
                }
            }

            toast({
                title: "Media uploaded.",
                description: `You have uploaded media for build ID "${buildId}".`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Reset and refetch media and links
            setMediaFile(null);
            setMediaLink('');
            setIsOpen(false);
            await fetchMedia();
            await fetchMediaLinks();

        } catch (error) {
            console.error('Error uploading media:', error);
            toast({
                title: "Error uploading media.",
                description: error.response ? String(error.response.data.message) : "Network error or server is not reachable.",
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
        } else {
            setIsLinkModalOpen(true);
        }
    };

    return (
        <Box>
            {mediaFiles.length > 0 || mediaLinks.length > 0 ? (
                <>
                    {mediaFiles.map((media, index) => (
                        <IconButton
                            key={index}
                            icon={<FaEye size={25} />}
                            onClick={() => handleMediaView(media.link || media.mediaLink)}
                            variant="outline"
                            title='View Media'
                            colorScheme="blue"
                            border={0}
                            ml={2}
                        />
                    ))}
                    {mediaLinks.map((link, index) => (
                        <IconButton
                            key={index}
                            icon={<FaEye size={25} />}
                            onClick={() => handleMediaView(link)}
                            variant="outline"
                            title='View Media Link'
                            colorScheme="blue"
                            border={0}
                            ml={2}
                        />
                    ))}
                </>
            ) : (
                <IconButton
                    icon={<IoMdCloudUpload size={25} />}
                    onClick={() => setIsOpen(true)}
                    variant="outline"
                    title='Upload Media'
                    colorScheme="teal"
                    border={0}
                />
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
                        <Input
                            placeholder="Enter media link"
                            value={mediaLink}
                            onChange={(e) => setMediaLink(e.target.value)}
                            mt={3}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <IconButton
                            colorScheme="teal"
                            onClick={handleMediaUpload}
                            isDisabled={!mediaFile && !mediaLink}
                            aria-label="Upload Media"
                            icon={<IoMdCloudUpload />}
                        />
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
                    <ViewLinkModal
                        isOpen={isLinkModalOpen}
                        onClose={() => setIsLinkModalOpen(false)}
                        link={selectedMediaLink}
                    />
                </>
            )}
        </Box>
    );
};

export default MediaUploaderForBuild;