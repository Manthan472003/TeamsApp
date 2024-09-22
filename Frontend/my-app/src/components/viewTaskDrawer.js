import React, { useState, useEffect, useCallback } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  Textarea,
  Input,
  Button,
  Tag,
  TagLabel,
  Icon,
  useToast,
  HStack,
  Divider,
  Image,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { FaPaperclip } from 'react-icons/fa';
import { saveMedia, getMedias } from '../Services/MediaService';

const ViewTaskDrawer = ({ isOpen, onClose, task, users, tags, onUpdate }) => {
  const [size] = useState('xl');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const toast = useToast();

  // Modal state for displaying all media
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [mediaToShow, setMediaToShow] = useState([]);

  const fetchMedia = useCallback(async () => {
    if (!task || !task.id) return; // Ensure the task ID is available

    try {
      const media = await getMedias(task.id); // Fetch media for the specific task ID
      setUploadedMedia(media); // Set state with the fetched media
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: 'Error fetching media.',
        description: 'Could not load media files.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [task, toast]);

  useEffect(() => {
    if (isOpen && task) {
      fetchMedia(); // Call to fetch media for the current task
      setMediaFiles([]); // Clear selected files
      // Removed setUploadedMedia([]) to retain fetched media
    }
  }, [fetchMedia, isOpen, task]);

  // Return early if task is not defined
  if (!task) {
    return (
      <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="2xl">TASK DETAILS</DrawerHeader>
          <DrawerBody>
            <Text fontSize="lg">No task selected.</Text>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setMediaFiles(files); // Ensure this updates correctly
  };

  const updateMedia = async () => {
    if (!task || !task.id) return;

    const formData = new FormData();
    mediaFiles.forEach((file) => {
      formData.append('mediaFiles', file); // Ensure the key matches what the backend expects
    });
    formData.append('taskId', task.id); // If your API expects the task ID as well

    // Check if files were added
    if (mediaFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one media file to upload.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await saveMedia(task.id, formData); // Pass the task ID here
      toast({
        title: 'Media Updated',
        description: 'Media files have been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      await fetchMedia(); // Refetch media after upload
    } catch (error) {
      console.error(
        'Failed to update media:',
        error.response ? error.response.data : error.message
      );
      toast({
        title: 'Update Failed',
        description: 'There was an error updating media files.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setMediaFiles([]); // Clear selected files
    }
  };

  const getTagNamesByIds = (tagIds) => {
    const tagMap = new Map(tags.map((tag) => [tag.id, tag.tagName]));
    return tagIds.map((id) => {
      const tagName = tagMap.get(id);
      return tagName || 'Unknown';
    });
  };

  const getUserNameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.userName : 'Unknown';
  };

  // Open modal to show all media
  const handleShowMore = () => {
    setMediaToShow(uploadedMedia); // Set all media for the modal view
    onModalOpen(); // Open the modal
  };

  const buttonStyles = {
    base: {
      fontSize: '23px',
      fontWeight: 'bold',
      color: '#ffffff', // Text color set to white
      backgroundImage:
        'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
      padding: '8px 6px',
      borderRadius: '0 0 30px 0',
      transition: 'all 0.3s ease',
      marginBottom: '2px',
      width: '100%',
      textAlign: 'left',
      justifyContent: 'start',
      paddingLeft: '20px', // Add left padding here
    },
  };

  return (
    <>
      <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader sx={buttonStyles.base}>TASK DETAILS</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Table variant="simple">
                <Tbody>
                  {/* Task Name */}
                  <Tr fontSize="lg">
                    <Td fontWeight="bold">Task Name :</Td>
                    <Td>{task.taskName || 'Unknown'}</Td>
                  </Tr>
                  <Divider />

                  {/* Due Date */}
                  <Tr fontSize="lg">
                    <Td fontWeight="bold">Due Date :</Td>
                    <Td>{formatDate(task.dueDate)}</Td>
                  </Tr>
                  <Divider />

                  {/* Assigned To */}
                  <Tr fontSize="lg">
                    <Td fontWeight="bold">Assigned To :</Td>
                    <Td>{getUserNameById(task.taskAssignedToID)}</Td>
                  </Tr>
                  <Divider />

                  {/* Status */}
                  <Tr fontSize="lg">
                    <Td fontWeight="bold">Status :</Td>
                    <Td>{task.status || 'Unknown'}</Td>
                  </Tr>
                  <Divider />

                  {/* Tags */}
                  <Tr fontSize="lg">
                    <Td fontWeight="bold">Tags :</Td>
                    <Td>
                      <HStack spacing={1} align="start">
                        {getTagNamesByIds(task.tagIDs || []).map(
                          (tagName, idx) => (
                            <Tag
                              size="md"
                              key={idx}
                              borderRadius="6px"
                              variant="solid"
                              colorScheme="green"
                            >
                              <TagLabel>{tagName}</TagLabel>
                            </Tag>
                          )
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                  <Divider />
                </Tbody>
              </Table>

              {/* Description Textarea */}
              <Text fontSize="lg">
                <strong>Description:</strong>
              </Text>
              <Textarea
                placeholder="Enter task description"
                value={task.description || ''}
                onChange={(e) =>
                  onUpdate({ ...task, description: e.target.value })
                }
                size="md"
                fontSize="md"
                resize="none"
              />

              {/* Media Upload Section */}
              <Text fontSize="lg">
                <strong>Upload Media Files:</strong>
              </Text>
              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                fontSize="md"
              />
              <Button
                colorScheme="teal"
                size="lg"
                onClick={updateMedia}
                mt={4}
                fontSize="md"
                leftIcon={<Icon as={FaPaperclip} />}
              >
                Update Media
              </Button>

              {/* Display Selected Files for Upload */}
              <Text fontSize="lg">
                <strong>Uploaded Files:</strong>
              </Text>
              {mediaFiles.length > 0 &&
                mediaFiles.map((file, index) => (
                  <Text key={index} fontSize="md">
                    {file.name}
                  </Text>
                ))}
              <Divider />

              {/* Display Fetched Media */}
              <Text fontSize="lg">
                <strong>Fetched Media:</strong>
              </Text>
              {uploadedMedia.length > 0 ? (
                <>
                  <SimpleGrid columns={6} spacing={4}>
                    {/* Display up to 3 images */}
                    {uploadedMedia.slice(0, 5).map((media, index) => (
                      <Image
                        key={index}
                        src={media.mediaLink}
                        alt={`media-${index}`}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    ))}
                    {/* If there are more than 3 images, show a "+(remaining images)" button */}
                    {uploadedMedia.length > 5 && (
                      <Button
                        onClick={handleShowMore}
                        boxSize="100px"
                        fontSize="md"
                        variant="outline"
                      >
                        +{uploadedMedia.length - 5}
                      </Button>
                    )}
                  </SimpleGrid>

                  {/* Modal to display all images */}
                  <Modal
                    isOpen={isModalOpen}
                    onClose={onModalClose}
                    size="xl"
                    isCentered
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>All Media Files</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <SimpleGrid columns={[2, 3]} spacing={4}>
                          {mediaToShow.map((media, index) => (
                            <Image
                              key={index}
                              src={media.mediaLink}
                              alt={`media-${index}`}
                              boxSize="100px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                          ))}
                        </SimpleGrid>
                      </ModalBody>
                      <ModalFooter>
                        <Button colorScheme="blue" onClick={onModalClose}>
                          Close
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  
                </>
              ) : (
                <Text fontSize="md">No media found.</Text>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ViewTaskDrawer;
