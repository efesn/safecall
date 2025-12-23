import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { 
    Container, Grid, Paper, Typography, Box, Button, 
    Card, CardContent, CardActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [ticketStats, setTicketStats] = useState({ open: 0, pending: 0, resolved: 0 });
    const [activeCalls, setActiveCalls] = useState(0);
    const [recentTickets, setRecentTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customersRes, ticketsRes, callsRes] = await Promise.all([
                    axiosInstance.get('crm/customers/'),
                    axiosInstance.get('crm/tickets/'),
                    axiosInstance.get('crm/calls/')
                ]);

                setCustomers(customersRes.data);

                // Calculate Ticket Stats
                const tickets = ticketsRes.data;
                setTicketStats({
                    open: tickets.filter(t => t.status === 'Open').length,
                    pending: tickets.filter(t => t.status === 'Pending').length,
                    resolved: tickets.filter(t => t.status === 'Resolved').length
                });
                
                // Get recent tickets (last 5)
                setRecentTickets(tickets.sort((a, b) => b.ticket_id - a.ticket_id).slice(0, 5));

                // Calculate Active Calls
                const calls = callsRes.data;
                setActiveCalls(calls.filter(c => !c.call_end_time).length);

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container maxWidth={false}>
            <Grid container spacing={3}>
                {/* Welcome Banner */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
                        <Typography variant="h4" gutterBottom color="primary">
                            Welcome back, Agent
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Here is what's happening in the call center today.
                        </Typography>
                    </Paper>
                </Grid>

                {/* Stats Cards - Row 1 */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderLeft: '5px solid #1976d2' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Total Customers
                            </Typography>
                            <Typography variant="h3" component="div">
                                {customers.length}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => document.getElementById('customer-list').scrollIntoView({ behavior: 'smooth' })}>View All</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderLeft: '5px solid #2e7d32' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Active Calls
                            </Typography>
                            <Typography variant="h3" component="div">
                                {activeCalls}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/call-history')}>View Logs</Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Stats Cards - Row 2 (Tickets) */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', borderLeft: '5px solid #d32f2f' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Open Tickets
                            </Typography>
                            <Typography variant="h3" component="div">
                                {ticketStats.open}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/tickets')}>Manage</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', borderLeft: '5px solid #ed6c02' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Pending Tickets
                            </Typography>
                            <Typography variant="h3" component="div">
                                {ticketStats.pending}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/tickets')}>Manage</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', borderLeft: '5px solid #2e7d32' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Resolved Tickets
                            </Typography>
                            <Typography variant="h3" component="div">
                                {ticketStats.resolved}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/tickets')}>View Archive</Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Customer List */}
                <Grid item xs={12} md={8} id="customer-list">
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" color="primary">
                                Recent Customers
                            </Typography>
                           {/*} <Button variant="contained" size="small">Add Customer</Button> */}
                        </Box>
                        
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customers.length > 0 ? (
                                        customers.slice(0, 5).map((customer) => (
                                            <TableRow key={customer.customer_id} hover>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar sx={{ width: 30, height: 30, mr: 1, bgcolor: '#1976d2', fontSize: '0.8rem' }}>
                                                            {customer.full_name.charAt(0)}
                                                        </Avatar>
                                                        {customer.full_name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{customer.email}</TableCell>
                                                <TableCell>{customer.phone_number}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={customer.account_status} 
                                                        color={customer.account_status === 'Active' ? 'success' : 'default'} 
                                                        size="small" 
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" variant="text">View</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography sx={{ py: 3 }} color="text.secondary">
                                                    No customers found.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Recent Tickets Widget */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" color="primary">
                                Recent Tickets
                            </Typography>
                            <Button size="small" onClick={() => navigate('/tickets')}>View All</Button>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentTickets.map((ticket) => (
                                        <TableRow key={ticket.ticket_id}>
                                            <TableCell>#{ticket.ticket_id}</TableCell>
                                            <TableCell>{ticket.title.substring(0, 20)}...</TableCell>
                                            <TableCell align="right">
                                                <Chip 
                                                    label={ticket.status} 
                                                    size="small" 
                                                    color={ticket.status === 'Open' ? 'error' : ticket.status === 'Pending' ? 'warning' : 'success'} 
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {recentTickets.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">No recent tickets</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
