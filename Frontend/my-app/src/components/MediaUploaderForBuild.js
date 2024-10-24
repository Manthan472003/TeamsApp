import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Input, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { IoMdCloudUpload } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { createMedia, getMediaOfTheTaskorBuild, } from '../Services/MediaService';
import { createBuildEntry, getBuildEntryById, fetchAllBuildEntries } from '../Services/BuildService';
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

    const [appId, setAppId] = useState('');
    const [deployedOn, setDeployedOn] = useState('');
    const [versionName, setVersionName] = useState('');
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);

    const fetchMedia = useCallback(async () => {
        try {
            const response = await getMediaOfTheTaskorBuild('Build', buildId);
            console.log('Fetched media files:', response.data);
            setMediaFiles(response.data);
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
            console.log('Fetched all build entries:', response.data);

            // Filter for media links related to the build context
            const buildEntriesWithLinks = response.data.filter(build => build.id !== buildId && build.link);

            if (buildEntriesWithLinks.length > 0) {
                const links = buildEntriesWithLinks.map(entry => entry.link);
                setMediaLinks(links);
            } else {
                console.warn('No media links found for buildId:', buildId);
                setMediaLinks([]);
            }
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

    const fetchBuildDetails = useCallback(async () => {
        try {
            const response = await getBuildEntryById(buildId);
            const buildData = response.data;

            setAppId(buildData.appId);
            setDeployedOn(buildData.deployedOn);
            setVersionName(buildData.versionName);
            setSelectedTaskIds(buildData.tasksForBuild || []);
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
        fetchMediaLinks();
        fetchBuildDetails();
    }, [fetchMedia, fetchMediaLinks, fetchBuildDetails]);

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
                await createMedia('Build', buildId, [mediaFile]);
            }

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
            fetchMediaLinks(); // Fetch updated media links
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
        console.log('Selected media link:', link);
        const isImage = link && (link.endsWith('.jpg') || link.endsWith('.png') || link.endsWith('.jpeg'));
        const isVideo = link && link.endsWith('.mp4');
        const isLink = link;
        setSelectedMediaLink(link);
        if (isImage) {
            setIsImageModalOpen(true);
        } else if (isVideo) {
            setIsVideoModalOpen(true);
        } else if (isLink) {
            setIsLinkModalOpen(true);
        } else {
            toast({
                title: "Unsupported media type.",
                description: "This media type cannot be viewed.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
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
