import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Input, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { IoMdCloudUpload } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { createMedia, getMediaOfTheTaskorBuild } from '../Services/MediaService';
import { createBuildEntry, getBuildEntryById } from '../Services/BuildService'; // Make sure to implement getBuildEntryById
import ViewImageModal from './ViewImageModal';
import ViewVideoModal from './ViewVideoModal';

const MediaUploaderForBuild = ({ buildId }) => {
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaLink, setMediaLink] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [mediaLinks, setMediaLinks] = useState([]);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [selectedMediaLink, setSelectedMediaLink] = useState(null);
    const toast = useToast();

    const [appId, setAppId] = useState('');
    const [deployedOn, setDeployedOn] = useState('');
    const [versionName, setVersionName] = useState('');
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);

    const fetchMedia = useCallback(async () => {
        try {
            const response = await getMediaOfTheTaskorBuild('Build', buildId);
            console.log('Fetched media links:', response.data); // Add this line
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

    const fetchBuildDetails = useCallback(async () => {
        try {
            const response = await getBuildEntryById(buildId); // Fetch the build details by ID
            const buildData = response.data;

            setAppId(buildData.appId);
            setDeployedOn(buildData.deployedOn);
            setVersionName(buildData.versionName);
            setSelectedTaskIds(buildData.tasksForBuild || []); // Assuming tasksForBuild is an array
        } catch (error) {
            console.error('Error fetching build details:', error);
            toast({
                title: "Error fetching build details.",
                description: String(error.response ? error.response.data.message : error.message),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [buildId, toast]);

    useEffect(() => {
        fetchMedia();
        fetchBuildDetails(); // Fetch build details on mount
    }, [fetchMedia, fetchBuildDetails]);

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
            // Upload media file if provided
            if (mediaFile) {
                await createMedia('Build', buildId, [mediaFile]);
            }

            // Upload media link if provided
            if (mediaLink) {
                const buildEntry = {
                    appId,
                    deployedOn,
                    versionName,
                    tasksForBuild: selectedTaskIds,
                    link: mediaLink,
                };
                await createBuildEntry(buildEntry);
            }

            toast({
                title: "Media uploaded.",
                description: `You have uploaded media for build ID "${buildId}".`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setMediaFile(null);
            setMediaLink('');
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
        console.log('Selected media link:', link); // Log the link
        const isImage = link && (link.endsWith('.jpg') || link.endsWith('.png') || link.endsWith('.jpeg'));
        const isVideo = link && link.endsWith('.mp4');

        setSelectedMediaLink(link);
        if (isImage) {
            setIsImageModalOpen(true);
        } else if (isVideo) {
            setIsVideoModalOpen(true);
        }
    };

    return (
        <Box>
            {mediaLinks.length > 0 ? (
                <>
                    {mediaLinks.map((media, index) => (

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
                </>
            )}
        </Box>
    );
};

export default MediaUploaderForBuild;