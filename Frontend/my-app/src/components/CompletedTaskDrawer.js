import React, { useState, useEffect, } from 'react';
import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerFooter, DrawerCloseButton, DrawerContent, Button, useDisclosure, Box, VStack, SimpleGrid, Input, Text } from '@chakra-ui/react';
import { TbRestore } from "react-icons/tb";
import ConfirmRestoreModal from './ConfirmRestoreModal';
import { getTags } from '../Services/TagService';
import { getSections } from '../Services/SectionService';

const CompletedTaskDrawer = ({ isOpen, onClose, task, onUpdateTask, users }) => {
    const [size] = useState('md');
    const [taskToRestore, setTaskToRestore] = useState(null);
    const { isOpen: isRestoreOpen, onOpen: onRestoreOpen, onClose: onRestoreClose } = useDisclosure();
    const [tags, setTags] = useState([]);
    const [localTask, setLocalTask] = useState(task || {}); // Initialize with an empty object
    const [sections, setSections] = useState([])

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getTags();
                setTags(response.data); // Assuming response.data contains the array of tags
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await getSections();
                setSections(response.data);
            } catch (error) {
                console.error('Error fetching Sections:', error);
            }
        };
        fetchSections();
    }, []);

    useEffect(() => {
        if (isOpen && task) {
            setLocalTask(task);
        }
    }, [isOpen, task]);

    const getTagNamesByIds = (tagIds) => {
        const tagMap = new Map(tags.map(tag => [tag.id, tag.tagName]));
        return tagIds.map(id => tagMap.get(id) || 'Unknown');
    };

    const getUserNameById = (userId) => {
        if (!Array.isArray(users) || users.length === 0) {


            console.error('Users data is not available');
            return 'Unknown';
        }

        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const getSectionNameById = (sectionId) => {
        if (!Array.isArray(sections) || sections.length === 0) {
            console.error('Sections data is not available');
            console.log(sections);
            return '--';
        }

        const section = sections.find(section => section.id === sectionId);
        return section ? section.sectionName : '-//-';
    };

    const confirmRestore = () => {
        if (onUpdateTask && taskToRestore) {
            console.log('Restoring task:', taskToRestore);
            onUpdateTask(taskToRestore.id, 'Not Started');
            setTaskToRestore(null);
            onRestoreClose();
            onClose();
        } else {
            console.error('onUpdateTask function is not defined or taskToRestore is missing');
        }
    };

    const handleRestoreClick = (task) => {
        setTaskToRestore(task);
        onRestoreOpen();
    };

    const buttonStyles = {
        base: {
            fontSize: '23px',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundImage: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
            padding: '8px 6px',
            borderRadius: '0 0 0 0',
            transition: 'all 0.3s ease',
            marginBottom: '2px',
            width: '100%',
            textAlign: 'left',
            justifyContent: 'start',
            paddingLeft: '20px',
        },
    };

    return (
        <>
            <Drawer onClose={onClose} isOpen={isOpen} size={size} >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton color={'white'} size={10} padding='10 3'/>
                    <DrawerHeader sx={buttonStyles.base}>TASK DETAILS</DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={4} align="stretch">
                            <Box pb="100">
                                <Box>
                                    <Text mt={2} mb={1} fontSize="lg" fontWeight="bold">Task Name:</Text>
                                    <Input value={localTask.taskName || ''} readOnly />
                                </Box>
                                <Box mt={2} >
                                    <Text mb={1} fontSize="lg" fontWeight="bold">Assigned To:</Text>
                                    <Input value={getUserNameById(localTask.taskAssignedToID)} readOnly />
                                </Box>

                                <SimpleGrid columns={2} spacing={4}>
                                    <Box mt={2} >
                                        <Text mb={1} fontSize="lg" fontWeight="bold">Section:</Text>
                                        <Input value={getSectionNameById(localTask.sectionID) || ''} readOnly />
                                    </Box>

                                    <Box mt={2}>
                                        <Text fontSize="lg" fontWeight="bold">Tags:</Text>
                                        <div mb={2} style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {getTagNamesByIds(localTask.tagIDs || []).map((tagName, idx) => (
                                                <span key={idx} style={{
                                                    display: 'inline-block',
                                                    backgroundColor: '#48bb78',
                                                    color: 'white',
                                                    borderRadius: '6px',
                                                    padding: '4px 8px',
                                                    margin: '2px'
                                                }}>
                                                    {tagName}
                                                </span>
                                            ))}
                                        </div>
                                    </Box>
                                </SimpleGrid>

                                <Text mt={2} mb={2} fontSize="lg"><strong>Description:</strong></Text>
                                <Input value={localTask.description || ''} readOnly />
                            </Box>

                            <DrawerFooter position="fixed" bottom="0" left="0" right="0" bg="white" zIndex="1">
                                <Button
                                    colorScheme="green"
                                    onClick={() => handleRestoreClick(task)}
                                    leftIcon={<TbRestore size={20} />}
                                >
                                    Restore
                                </Button>
                            </DrawerFooter>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Restore Confirmation Modal */}
            <ConfirmRestoreModal
                isOpen={isRestoreOpen}
                onClose={onRestoreClose}
                onConfirm={confirmRestore}
                itemName={taskToRestore ? taskToRestore.taskName : ''}
            />
        </>
    );
};

export default CompletedTaskDrawer;