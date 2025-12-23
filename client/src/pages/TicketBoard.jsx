import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { 
    Container, Typography, Box, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, IconButton
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TicketBoard = () => {
    const [tickets, setTickets] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [editForm, setEditForm] = useState({
        status: '',
        priority_level: '',
        description: ''
    });
    const [createForm, setCreateForm] = useState({
        title: '',
        customer: '',
        priority_level: 'Medium',
        issue_category: 'General',
        description: ''
    });

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [ticketsRes, customersRes] = await Promise.all([
                axiosInstance.get('crm/tickets/'),
                axiosInstance.get('crm/customers/')
            ]);
            setTickets(ticketsRes.data);
            setCustomers(customersRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = (ticket) => {
        setSelectedTicket(ticket);
        setEditForm({
            status: ticket.status,
            priority_level: ticket.priority_level,
            description: ticket.description
        });
        setOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await axiosInstance.patch(`crm/tickets/${selectedTicket.ticket_id}/`, editForm);
            setOpen(false);
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Error updating ticket", error);
            alert("Failed to update ticket.");
        }
    };

    const handleCreate = async () => {
        try {
            await axiosInstance.post('crm/tickets/', createForm);
            setCreateOpen(false);
            fetchData();
            setCreateForm({
                title: '',
                customer: '',
                priority_level: 'Medium',
                issue_category: 'General',
                description: ''
            });
        } catch (error) {
            console.error("Error creating ticket", error);
            alert("Failed to create ticket.");
        }
    };

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
                <Button variant="contained" color="primary" onClick={() => setCreateOpen(true)}>
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
                            <TableCell>Actions</TableCell>
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
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(ticket)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {tickets.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Ticket #{selectedTicket?.ticket_id}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                value={editForm.status}
                                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                            >
                                <MenuItem value="Open">Open</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Resolved">Resolved</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Priority"
                                value={editForm.priority_level}
                                onChange={(e) => setEditForm({...editForm, priority_level: e.target.value})}
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                value={editForm.description}
                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained" color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Ticket</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={createForm.title}
                                onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Customer"
                                value={createForm.customer}
                                onChange={(e) => setCreateForm({...createForm, customer: e.target.value})}
                            >
                                {customers.map((customer) => (
                                    <MenuItem key={customer.customer_id} value={customer.customer_id}>
                                        {customer.full_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Priority"
                                value={createForm.priority_level}
                                onChange={(e) => setCreateForm({...createForm, priority_level: e.target.value})}
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Category"
                                value={createForm.issue_category}
                                onChange={(e) => setCreateForm({...createForm, issue_category: e.target.value})}
                            >
                                <MenuItem value="General">General</MenuItem>
                                <MenuItem value="Technical">Technical</MenuItem>
                                <MenuItem value="Billing">Billing</MenuItem>
                                <MenuItem value="Feature Request">Feature Request</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                value={createForm.description}
                                onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TicketBoard;
