import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TicketBoard from './pages/TicketBoard';
import Campaigns from './pages/Campaigns';
import Customers from './pages/Customers';
import CallHistory from './pages/CallHistory';
import SecurityLogs from './pages/SecurityLogs';
import SupervisorDashboard from './pages/SupervisorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/supervisor" element={<SupervisorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/tickets" element={<TicketBoard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/call-history" element={<CallHistory />} />
            <Route path="/security-logs" element={<SecurityLogs />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
