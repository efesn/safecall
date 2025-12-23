import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { 
    Container, Typography, Box, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, MenuItem, Grid, Alert
} from '@mui/material';
import { PhoneCallback, PhoneForwarded, ConfirmationNumber as TicketIcon } from '@mui/icons-material';

const CallHistory = () => {
    const [calls, setCalls] = useState([]);
    const [openTicketDialog, setOpenTicketDialog] = useState(false);
    const [selectedCall, setSelectedCall] = useState(null);
    const [ticketForm, setTicketForm] = useState({
        title: '',
        description: '',
        priority_level: 'Medium',
        issue_category: 'General',
        status: 'Open'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handleCreateTicketClick = (call) => {
        setSelectedCall(call);
        setTicketForm({
            title: `Ticket for Call #${call.call_id}`,
            description: `Generated from call with ${call.customer_name || 'Customer'}. \n\nCall Notes: ${call.notes || 'N/A'}`,
            priority_level: 'Medium',
            issue_category: 'General',
            status: 'Open'
        });
        setOpenTicketDialog(true);
        setError('');
        setSuccess('');
    };

    const handleTicketSubmit = async () => {
        try {
            const payload = {
                ...ticketForm,
                customer: selectedCall.customer,
                call: selectedCall.call_id
            };
            
            await axiosInstance.post('crm/tickets/', payload);
            setSuccess('Ticket created successfully!');
            setTimeout(() => {
                setOpenTicketDialog(false);
                setSuccess('');
            }, 1500);
        } catch (err) {
            console.error("Error creating ticket", err);
            setError('Failed to create ticket. Please try again.');
        }
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
                            <TableCell>Actions</TableCell>
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
                                <TableCell>
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        startIcon={<TicketIcon />}
                                        onClick={() => handleCreateTicketClick(call)}
                                    >
                                        Create Ticket
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {calls.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    No calls found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Ticket Dialog */}
            <Dialog open={openTicketDialog} onClose={() => setOpenTicketDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create Ticket from Call #{selectedCall?.call_id}</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={ticketForm.title}
                                onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Priority"
                                value={ticketForm.priority_level}
                                onChange={(e) => setTicketForm({...ticketForm, priority_level: e.target.value})}
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
                                value={ticketForm.issue_category}
                                onChange={(e) => setTicketForm({...ticketForm, issue_category: e.target.value})}
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
                                value={ticketForm.description}
                                onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTicketDialog(false)}>Cancel</Button>
                    <Button onClick={handleTicketSubmit} variant="contained" color="primary">
                        Create Ticket
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CallHistory;
