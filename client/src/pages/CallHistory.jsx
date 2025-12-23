import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { 
    Container, Typography, Box, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from '@mui/material';
import { PhoneCallback, PhoneForwarded } from '@mui/icons-material';

const CallHistory = () => {
    const [calls, setCalls] = useState([]);

    const fetchCalls = async () => {
        try {
            const response = await axiosInstance.get('crm/calls/');
            setCalls(response.data);
        } catch (error) {
            console.error("Error fetching calls", error);
        }
    };

    useEffect(() => {
        fetchCalls();
    }, []);

    const formatDuration = (start, end) => {
        if (!end) return 'Ongoing';
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diff = Math.floor((endTime - startTime) / 1000); // seconds
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        return `${minutes}m ${seconds}s`;
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" gutterBottom>
                    Call History
                </Typography>
            </Box>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="calls table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Agent</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.call_id}>
                                <TableCell>#{call.call_id}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {call.call_type === 'Inbound' ? <PhoneCallback color="primary" fontSize="small" /> : <PhoneForwarded color="secondary" fontSize="small" />}
                                        {call.call_type}
                                    </Box>
                                </TableCell>
                                <TableCell>{call.customer_name || `Customer #${call.customer}`}</TableCell>
                                <TableCell>{call.agent_name || 'System'}</TableCell>
                                <TableCell>{new Date(call.call_start_time).toLocaleString()}</TableCell>
                                <TableCell>{formatDuration(call.call_start_time, call.call_end_time)}</TableCell>
                                <TableCell>{call.notes}</TableCell>
                            </TableRow>
                        ))}
                        {calls.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No calls found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default CallHistory;
