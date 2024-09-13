// components/CustomButton.js
import React from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CustomButton = ({ icon, path, isActive, onClick, children }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (path) navigate(path);
    if (onClick) onClick();
  };

  const buttonStyles = {
    base: {
      fontSize: '18px',
      fontWeight: 'bold',
      borderWidth: '1px',
      borderColor: 'white',
      color: '#086F83',
      padding: '8px 6px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      marginBottom: '2px',
      width: '100%',
      textAlign: 'left',
      justifyContent: 'start',
    },
    hover: {
      color: '#ffffff',
      background: "#007bff",
    },
    active: {
      borderWidth: '2px',
      borderColor: '#007bff',
      backgroundImage: "linear-gradient(288deg, rgba(0,85,255,1) 1.5%, rgba(4,56,115,1) 91.6%)",
      color: '#ffffff',
      _hover: {
        backgroundImage: "linear-gradient(288deg, rgba(0,85,255,0.8) 1.5%, rgba(4,56,115,0.8) 91.6%)",
      },
    },
  };

  return (
    <Button
      leftIcon={icon}
      {...buttonStyles.base}
      {...(isActive && buttonStyles.active)}
      _hover={{ ...buttonStyles.hover }}
      onClick={handleNavigation}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
