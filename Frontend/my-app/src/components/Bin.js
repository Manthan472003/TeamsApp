import React, { useEffect, useState, useCallback } from 'react';
import { getDeletedTasks, restoreTask } from '../Services/TaskService';
import { useToast, Heading, Box, IconButton , useDisclosure} from '@chakra-ui/react';
import { TbRestore } from 'react-icons/tb';
import { getUsers } from '../Services/UserService';
import ConfirmRestoreModal from './ConfirmRestoreModal';
import { getTags } from '../Services/TagService';
import { deleteTaskPermanently } from '../Services/TaskService';
import { ImBin2 } from "react-icons/im";
import ConfirmDeleteModal from './ConfirmDeleteModal';

const Bin = () => {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [deletedTasks, setDeletedTasks] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [taskToRestore, setTaskToRestore] = useState(null);
  const [taskToPermanentlyDelete, setTaskToPermanentlyDelete] = useState(null);
  const [tags, setTags] = useState([]);
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Fetch Users Error:', err);
      toast({
        title: "Error fetching users.",
        description: "Unable to fetch users. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const fetchTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    const fetchDeletedTasks = async () => {
      try {
        const response = await getDeletedTasks();
        setDeletedTasks(response.data);
      } catch (err) {
        setError('Failed to fetch deleted tasks.');
        console.error(err);
      }
    };

    fetchDeletedTasks();
    fetchTags();
    fetchUsers();
  }, [fetchUsers]);

  const openRestoreModal = (task) => {
    setTaskToRestore(task);
    setIsRestoreModalOpen(true);
  };

  const handleRestore = async () => {
    if (taskToRestore) {
      try {
        await restoreTask(taskToRestore.id);
        setDeletedTasks(prevTasks => prevTasks.filter(task => task.id !== taskToRestore.id));
        toast({
          title: "Task Restored",
          description: "The task has been restored successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        setError('Failed to restore task.');
        console.error(err);
      } finally {
        setIsRestoreModalOpen(false);
        setTaskToRestore(null);
      }
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToPermanentlyDelete(task);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (taskToPermanentlyDelete) {
      try {
        await deleteTaskPermanently(taskToPermanentlyDelete.id); // Call deleteTask API
        setTaskToPermanentlyDelete(null);
        onDeleteClose();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getTagNamesByIds = (tagIds) => {
    const tagMap = new Map(tags.map(tag => [tag.id, tag.tagName]));

    return tagIds.map(id => {
      const tagName = tagMap.get(id);
      if (!tagName) {
        console.error(`No tag found for ID: ${id}`);
        return 'Unknown';
      }
      return tagName;
    });
  };

  const getUserNameById = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.userName : 'Unknown';
  };

  return (
    <Box p={5}>
      <Heading as='h2' size='xl' paddingLeft={3} mb={3} sx={{
        background: 'linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline-block',
      }}>
        Deleted Tasks
      </Heading>
      {error && <p className="error">{error}</p>}
      <div style={{ borderRadius: 'xl', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', variant: 'simple' }}>
          <thead>
            <tr>
              <th style={{ width: '50%', padding: '10px', textAlign: 'left', backgroundColor: '#f7fafc' }}>Task Name</th>
              <th style={{ width: '20%', padding: '10px', textAlign: 'left', backgroundColor: '#f7fafc' }}>Tags</th>
              <th style={{ width: '20%', padding: '10px', textAlign: 'left', backgroundColor: '#f7fafc' }}>Assigned To</th>
              <th style={{ width: '10%', padding: '10px', textAlign: 'left', backgroundColor: '#f7fafc' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deletedTasks.length > 0 ? (
              deletedTasks.map((task, index) => (
                <tr key={task.id} style={{ backgroundColor: index % 2 === 0 ? '#ebfff0' : '#d7f2ff' }}>
                  <td style={{ padding: '10px' }}>{task.taskName}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {getTagNamesByIds(task.tagIDs || []).map((tagName, idx) => (
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
                  </td>
                  <td style={{ padding: '10px' }}>{getUserNameById(task.taskAssignedToID)}</td>
                  <td style={{ padding: '10px' }}>
                    <IconButton
                      icon={<TbRestore size={20} />}
                      variant="outline"
                      title='Restore'
                      border={0}
                      colorScheme="green"
                      onClick={() => openRestoreModal(task)}
                    />
                    <IconButton
                      icon={<ImBin2 size={20} />}
                      onClick={() => handleDeleteClick(task)}
                      variant="outline"
                      title='Delete'
                      border={0}
                      colorScheme="red"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#a0aec0', padding: '10px' }}>
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        itemName={taskToPermanentlyDelete ? taskToPermanentlyDelete.taskName : ''}
      />

      <ConfirmRestoreModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={handleRestore}
        itemName={taskToRestore ? taskToRestore.taskName : ''}
      />
    </Box>
  );
};

export default Bin;