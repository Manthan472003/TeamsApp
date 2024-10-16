import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screen/login';
import Signup from './screen/signup';
import MainScreen from './screen1/mainScreen';
import TaskManager from './components/TaskManager';
import CompletedTask from './components/CompletedTask';
import Bin from './components/Bin';
import VersionManagement from './components/VersionManagement';
import MyTasks from './components/MyTasks';
import DailyReports from './components/DailyReports';
import Sections from './components/Sections';
import Users from './components/Users';
import Profile from './components/Profile'
import AppVersionManagement from './components/AppVersionManagement';
import QADashboard from './components/QADashboard';
import BuildDashboard from './components/BuildDashboard';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<MainScreen />}>
            <Route index element={<TaskManager />} />
          </Route>

          <Route path="/QA-tester" element={<MainScreen />}>
            <Route index element={<QADashboard />} />
          </Route>

          <Route path="/build" element={<MainScreen />}>
            <Route index element={<BuildDashboard />} />
          </Route>

          <Route path="/completed-tasks" element={<MainScreen />}>
            <Route index element={<CompletedTask />} />
          </Route>
          <Route path="/bin" element={<MainScreen />}>
            <Route index element={<Bin />} />
          </Route>
          <Route path="/tech-used" element={<MainScreen />}>
            <Route index element={<VersionManagement />} />
          </Route>
          <Route path="/my-tasks" element={<MainScreen />}>
            <Route index element={<MyTasks />} />
          </Route>
          <Route path="/daily-reports" element={<MainScreen />}>
            <Route index element={<DailyReports />} />
          </Route>
          <Route path="sections" element={<MainScreen />}>
            <Route index element={<Sections />} />
          </Route>
          <Route path="/users" element={<MainScreen />}>
            <Route index element={<Users />} />
          </Route>

          <Route path="/profile" element={<MainScreen />}>
            <Route index element={<Profile />} />
          </Route>

          <Route path="/app-version-management" element={<MainScreen />}>
            <Route index element={<AppVersionManagement />} />
          </Route>

        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;