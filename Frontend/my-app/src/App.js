// App.js
import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screen/login';
import Signup from './screen/signup';
import MainScreen from './screen1/mainScreen';  
import TaskManager from './components/TaskManager';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<MainScreen />} /> 
          <Route path="/home" element={<TaskManager />} /> 

        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
