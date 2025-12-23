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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('crm/customers/');
                setCustomers(response.data);
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

                {/* Stats Cards */}
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', borderLeft: '5px solid #2e7d32' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Active Calls
                            </Typography>
                            <Typography variant="h3" component="div">
                                0
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">View Logs</Button>
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
                                0
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/tickets')}>Manage Tickets</Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Customer List */}
                <Grid item xs={12} id="customer-list">
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" color="primary">
                                Recent Customers
                            </Typography>
                            <Button variant="contained" size="small">Add Customer</Button>
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
                                        customers.map((customer) => (
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
            </Grid>
        </Container>
    );
};

export default Dashboard;
