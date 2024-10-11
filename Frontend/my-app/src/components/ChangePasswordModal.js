import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Box,
} from '@chakra-ui/react';
import { updateUser } from '../Services/UserService'; // Import your updateUser service
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const ChangePasswordModal = ({ userId, isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const toast = useToast();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await updateUser(userId, { password: newPassword, currentPassword });

      toast({
        title: "Success",
        description: "Password changed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error changing your password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleToggleShow = (setter) => () => {
    setter((prev) => !prev);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Password</ModalHeader>
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
            <InputGroup>
              <Input
                type={showCurrent ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <InputRightElement>
                <Button onClick={handleToggleShow(setShowCurrent)} variant="link">
                  <Box fontSize="lg">
                    {showCurrent ? <FaEyeSlash /> : <FaEye />}
                  </Box>
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="newPassword">New Password</FormLabel>
            <InputGroup>
              <Input
                type={showNew ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <InputRightElement>
                <Button onClick={handleToggleShow(setShowNew)} variant="link">
                  <Box fontSize="lg">
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </Box>
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirm ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              <InputRightElement>
                <Button onClick={handleToggleShow(setShowConfirm)} variant="link">
                  <Box fontSize="lg">
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </Box>
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleChangePassword}>
            Change Password
          </Button>
          <Button variant="ghost" onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;