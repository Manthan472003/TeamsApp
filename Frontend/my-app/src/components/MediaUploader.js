import React, { useState, useEffect, useCallback } from 'react';
import {
    Text,
    Button,
    Icon,
    SimpleGrid,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    VStack,
    Spinner,
    Box,
    Stack,
    Divider,
} from '@chakra-ui/react';
import { FaTimesCircle, FaPlus } from 'react-icons/fa';
import { getMediaOfTheTaskorBuild, deleteMedia } from '../Services/MediaService';
import AddMediaModal from './AddMediaModal';
import ViewImageModal from './ViewImageModal';
import ViewVideoModal from './ViewVideoModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const MediaUploader = ({ taskId, onUpdate }) => {
    const [uploadedMedia, setUploadedMedia] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isOpen: isAddMediaOpen, onOpen: onAddMediaOpen, onClose: onAddMediaClose } = useDisclosure();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [mediaToShow, setMediaToShow] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isImageModalOpen, setImageModalOpen] = useState(false);
    const [isVideoModalOpen, setVideoModalOpen] = useState(false);
    const [videoThumbnails, setVideoThumbnails] = useState({});
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState(null);

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getMediaOfTheTaskorBuild('Task',taskId);
            setUploadedMedia(data);
        } catch (error) {
            console.error('Error fetching media:', error);
            alert('Failed to load media. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        if (taskId) {
            fetchMedia();
        }
    }, [taskId, fetchMedia]);

    const handleMediaClick = (media) => {
        setSelectedMedia(media);
        if (media.mediaType === 'Image') {
            setImageModalOpen(true);
        } else if (media.mediaType === 'Video') {
            setVideoModalOpen(true);
        }
    };

    const handleDeleteMedia = (media) => {
        setMediaToDelete(media);
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (mediaToDelete) {
            try {
                await deleteMedia(mediaToDelete.id);
                fetchMedia(); // Refresh media after deletion
            } catch (error) {
                console.error('Failed to delete media:', error);
                alert('Failed to delete media. Please try again.');
            }
            setMediaToDelete(null);
            setConfirmDeleteOpen(false);
        }
    };

    const renderMediaThumbnail = (media) => {
        return (
            <Box position="relative" boxSize="100px" onClick={() => handleMediaClick(media)}>
                {media.mediaType === 'Image' ? (
                    <Image
                        src={media.mediaLink}
                        alt={`media-${media.id}`}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                        cursor="pointer"
                        boxShadow="md"
                    />
                ) : (
                    <Box position="relative">
                        <video
                            src={media.mediaLink}
                            style={{ width: '100%', height: '100%', borderRadius: 'md' }}
                            onLoadedData={(e) => {
                                const thumbnail = e.target;
                                thumbnail.pause();
                                thumbnail.currentTime = 1;
                                const canvas = document.createElement('canvas');
                                canvas.width = 100;
                                canvas.height = 100;
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(thumbnail, 0, 0, canvas.width, canvas.height);
                                setVideoThumbnails((prev) => ({
                                    ...prev,
                                    [media.id]: canvas.toDataURL(),
                                }));
                            }}
                        />
                        {videoThumbnails[media.id] && (
                            <Image
                                src={videoThumbnails[media.id]}
                                alt={`thumbnail-${media.id}`}
                                position="absolute"
                                boxSize="100px"
                                top={0}
                                left={0}
                                width="100%"
                                height="100%"
                                borderRadius="md"
                                cursor="pointer"
                            />
                        )}
                    </Box>
                )}
                <Icon
                    as={FaTimesCircle}
                    color="red.500"
                    position="absolute"
                    top={-3}
                    right={-3}
                    cursor="pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMedia(media);
                    }}
                />
            </Box>
        );
    };

    return (
        <VStack spacing={4} align="stretch">
            <Stack direction="row" spacing={2} width={'100%'}>
                <Text mt={2} fontSize="lg" fontWeight="bold">Upload Media Files:</Text>
            </Stack>

            <Button
                colorScheme="blue"
                size="lg"
                onClick={onAddMediaOpen}
                leftIcon={<FaPlus />}
                width={170}
            >
                Add Media
            </Button>
            <Divider />
            {loading ? (
                <Spinner size="lg" />
            ) : uploadedMedia.length > 0 ? (
                <SimpleGrid columns={6} spacing={4}>
                    {uploadedMedia.slice(0, 5).map((media) => (
                        <Box key={media.id} onClick={() => handleMediaClick(media)}>
                            {renderMediaThumbnail(media)}
                        </Box>
                    ))}
                    {uploadedMedia.length > 5 && (
                        <Button
                            onClick={() => {
                                setMediaToShow(uploadedMedia);
                                onOpen();
                            }}
                            boxSize="100px"
                            fontSize="md"
                            variant="outline"
                            colorScheme="blue"
                        >
                            +{uploadedMedia.length - 5}
                        </Button>
                    )}
                </SimpleGrid>
            ) : (
                <Text fontSize="md">No media found.</Text>
            )}

            {/* Add Media Modal */}
            <AddMediaModal
                isOpen={isAddMediaOpen}
                onClose={onAddMediaClose}
                taskId={taskId}
                onUploadComplete={fetchMedia}
            />

            {/* Modals for media display */}
            {isImageModalOpen && selectedMedia && selectedMedia.mediaType === 'Image' && (
                <ViewImageModal
                    isOpen={isImageModalOpen}
                    onClose={() => setImageModalOpen(false)}
                    imageSrc={selectedMedia.mediaLink}
                />
            )}
            {isVideoModalOpen && selectedMedia && selectedMedia.mediaType === 'Video' && (
                <ViewVideoModal
                    isOpen={isVideoModalOpen}
                    onClose={() => setVideoModalOpen(false)}
                    videoSrc={selectedMedia.mediaLink}
                />
            )}
            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>All Media Files</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={[2, 3]} spacing={4}>
                            {mediaToShow.map((media) => (
                                <Box key={media.id} position="relative" onClick={() => handleMediaClick(media)}>
                                    {renderMediaThumbnail(media)}
                                </Box>
                            ))}
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedMedia?.mediaType === 'Image' ? 'this image' : 'this video'}
            />
        </VStack>
    );
};

export default MediaUploader;