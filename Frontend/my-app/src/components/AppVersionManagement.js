import React, { useState, useEffect } from 'react';
import { Box, Button, useDisclosure, Heading, Stack } from '@chakra-ui/react';
import AppVersionManagementTable from './AppVersionManagementTable';
import AppVersionManagementModal from './AppVersionManagementModal';
import EditAppVersionManagementModal from './EditAppVersionManagementModal';
import { createNewAppVersionManagementEntry, getAllAppVersionManagementEntries, versionAcceptedById } from '../Services/AppVersionManagementService';
import { getUsers } from '../Services/UserService';
import ExportToExcel from './ExportToExcel';
import ExportToPDF from './ExportToPdf';
import { IoMdAddCircleOutline } from "react-icons/io";

const AppVersionManagement = () => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const [entries, setEntries] = useState([]); // Ensure initial state is an empty array
  const [users, setUsers] = useState([]); // Ensure initial state is an empty array
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entriesResponse, usersResponse] = await Promise.all([
          getAllAppVersionManagementEntries(),
          getUsers(),
        ]);

        setEntries(entriesResponse.data || []);
        setUsers(usersResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAcceptVersion = async (id) => {
    try {
      const response = await versionAcceptedById(id);
      console.log(response.data.message); // Log success message

      // Update the entries state after acceptance
      setEntries((prevEntries) =>
        prevEntries.map(entry =>
          entry.id === id ? {
            ...entry,
            liveVersion: entry.testVersion,
            testVersion: null,
            status: null,
            updatedAt: new Date() // Update the timestamp
          } : entry
        )
      );

    } catch (error) {
      console.error('Error accepting version:', error.response ? error.response.data : error.message);
    }
  };


  // Handle saving a new entry
  const handleSave = async (data) => {
    try {
      await createNewAppVersionManagementEntry(data);
      const response = await getAllAppVersionManagementEntries();
      setEntries(response.data);
      onAddClose();
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  // Handle editing an entry
  const handleEdit = (id) => {
    if (id) {
      setSelectedEntryId(id);
      onEditOpen();
    }
  };

  // Handle updating an entry
  const handleUpdateEntry = (updatedEntry) => {
    if (!updatedEntry.updatedAt) {
      // If updatedAt is missing from the response, manually set it to the current date
      updatedEntry.updatedAt = new Date().toISOString();
    }
  
    // Update the entries state
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };
  





  const columns = [
    { key: 'applicationName', label: 'Application Name' },
    { key: 'liveVersion', label: 'Live Version' },
    { key: 'testVersion', label: 'Test Version' },
    { key: 'status', label: 'Status' },
    { key: 'updatedAt', label: 'Updated At' }
  ];

  const enrichedEntries = entries.map(entry => ({
    ...entry,
    updatedAt: entry.updatedAt && !isNaN(new Date(entry.updatedAt)) ? new Date(entry.updatedAt).toLocaleDateString() : 'Unknown',
    userId: entry.userId ? users.find(user => user.id === entry.userId)?.userName || 'Unknown' : 'Unknown',
  }));
  
  



  return (
    <Box p={5}>
      <Heading as='h2' size='xl' paddingLeft={3}
        sx={{
          background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
          backgroundClip: 'text',
          color: 'transparent',
          display: 'inline-block',
        }}
      >
        App Version Management
      </Heading>
      <br />
      <Stack direction="row" width={1000} spacing={2} mt={3} mb={4}>
        <Button leftIcon={<IoMdAddCircleOutline size={23} />} onClick={onAddOpen} colorScheme='teal' variant='outline'>
          Add Entry
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} mt={3} mb={4}>
        <ExportToExcel reports={entries} />
        <ExportToPDF
          data={enrichedEntries}
          columns={columns}
          fileName="app-version_management_reports.pdf"
          header="App Version Status"
        />
      </Stack>

      <AppVersionManagementModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        onSubmit={handleSave}
      />
      <EditAppVersionManagementModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        entryId={selectedEntryId}
        onUpdate={handleUpdateEntry}
      />
      <AppVersionManagementTable
        entries={enrichedEntries}
        onEdit={handleEdit}
        onAccept={handleAcceptVersion}
      />
    </Box>
  );
};

export default AppVersionManagement;