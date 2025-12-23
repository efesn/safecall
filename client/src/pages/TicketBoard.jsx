import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { Container, Grid, Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TicketBoard = () => {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axiosInstance.get('crm/tickets/');
                setTickets(response.data);
            } catch (error) {
                console.error("Error fetching tickets", error);
            }
        };

        fetchTickets();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'error';
            case 'Pending': return 'warning';
            case 'Resolved': return 'success';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" gutterBottom>
                    Ticket Board
                </Typography>
                <Button variant="contained" color="primary">
                    Create Ticket
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Agent</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow
                                key={ticket.ticket_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    #{ticket.ticket_id}
                                </TableCell>
                                <TableCell>{ticket.title}</TableCell>
                                <TableCell>{ticket.customer_name}</TableCell>
                                <TableCell>{ticket.priority_level}</TableCell>
                                <TableCell>
                                    <Chip label={ticket.status} color={getStatusColor(ticket.status)} size="small" />
                                </TableCell>
                                <TableCell>{ticket.agent_name}</TableCell>
                            </TableRow>
                        ))}
                        {tickets.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default TicketBoard;
