import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { 
    Container, Typography, Box, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, Chip 
} from '@mui/material';

const SecurityLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axiosInstance.get('core/security-logs/');
                setLogs(response.data);
            } catch (error) {
                console.error("Error fetching security logs", error);
            }
        };

        fetchLogs();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box mb={3}>
                <Typography variant="h4" gutterBottom>
                    Security Logs
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Audit trail of system access and security events.
                </Typography>
            </Box>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="security logs table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Event Type</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>IP Address</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.log_id}>
                                <TableCell>#{log.log_id}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={log.event_type} 
                                        color={log.event_type === 'Failed Attempt' ? 'error' : 'success'} 
                                        size="small" 
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{log.user || 'Unknown'}</TableCell>
                                <TableCell>{log.ip_address}</TableCell>
                                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{log.description}</TableCell>
                            </TableRow>
                        ))}
                        {logs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No logs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default SecurityLogs;
