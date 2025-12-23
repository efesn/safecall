import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { 
    Container, Typography, Box, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const fetchCustomers = async () => {
        try {
            const response = await axiosInstance.get('crm/customers/');
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers", error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleViewCustomer = async (id) => {
        try {
            // This specific GET request triggers the Data Access Log on the backend
            const response = await axiosInstance.get(`crm/customers/${id}/`);
            setSelectedCustomer(response.data);
            setOpenDialog(true);
        } catch (error) {
            console.error("Error fetching customer details", error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCustomer(null);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" gutterBottom>
                    Customers
                </Typography>
            </Box>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="customers table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.customer_id}>
                                <TableCell>#{customer.customer_id}</TableCell>
                                <TableCell>{customer.full_name}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone_number}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={customer.account_status} 
                                        color={customer.account_status === 'Active' ? 'success' : 'default'} 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => handleViewCustomer(customer.customer_id)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {customers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No customers found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Customer Details</DialogTitle>
                <DialogContent dividers>
                    {selectedCustomer && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
                                <Typography variant="body1">{selectedCustomer.full_name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                                <Typography variant="body1">{selectedCustomer.email}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                                <Typography variant="body1">{selectedCustomer.phone_number}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                                <Typography variant="body1">{selectedCustomer.address || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">Registration Date</Typography>
                                <Typography variant="body1">{new Date(selectedCustomer.registration_date).toLocaleDateString()}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                                <Chip 
                                    label={selectedCustomer.account_status} 
                                    color={selectedCustomer.account_status === 'Active' ? 'success' : 'default'} 
                                    size="small" 
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Customers;
