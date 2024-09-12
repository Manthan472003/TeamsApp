// App.js
import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screen/login';
import Signup from './screen/signup';
import MainScreen from './screen1/mainScreen';
import TaskManager from './components/TaskManager';
import CompletedTask from './components/CompletedTask'; 
import Bin from './components/Bin'; 
import TechnologyUsed from './components/TechnologyUsed'; 

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<MainScreen />}>
            <Route index element={<TaskManager />} /> {/* Default nested route */}
          </Route>
          <Route path="/completed-tasks" element={<MainScreen />}>
            <Route index element={<CompletedTask />} />
          </Route>
          <Route path="/bin" element={<MainScreen />}>
            <Route index element={<Bin />} />
          </Route>
          <Route path="/tech-used" element={<MainScreen />}>
            <Route index element={<TechnologyUsed />} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
