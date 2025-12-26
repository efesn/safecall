import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import {
    Container, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Select, MenuItem, FormControl, InputLabel, Box, Alert, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Agent',
        department: 'Support',
        phone_extension: ''
    });

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('core/users/');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpen = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                password: '', // Don't show password
                role: user.role,
                department: user.department || '',
                phone_extension: user.phone_extension || ''
            });
        } else {
            setCurrentUser(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'Agent',
                department: 'Support',
                phone_extension: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentUser(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const data = { ...formData };
            if (!data.password) delete data.password; // Remove empty password if not setting it

            if (currentUser) {
                await axiosInstance.patch(`core/users/${currentUser.id}/`, data);
            } else {
                await axiosInstance.post('core/users/', data);
            }
            fetchUsers();
            handleClose();
        } catch (err) {
            console.error(err);
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axiosInstance.delete(`core/users/${id}/`);
                fetchUsers();
            } catch (err) {
                console.error(err);
                alert('Delete failed');
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">User Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Add User
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Extension</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.department}</TableCell>
                                <TableCell>{user.phone_extension}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(user)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(user.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentUser ? 'Edit User' : 'Add User'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 400 }}>
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label={currentUser ? "New Password (leave blank to keep)" : "Password"}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                label="Role"
                                onChange={handleChange}
                            >
                                <MenuItem value="Agent">Agent</MenuItem>
                                <MenuItem value="Supervisor">Supervisor</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Phone Extension"
                            name="phone_extension"
                            value={formData.phone_extension}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;