import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { 
    Container, Typography, Box, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider,
    Autocomplete
} from '@mui/material';
import { Group as GroupIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [open, setOpen] = useState(false);
    const [membersOpen, setMembersOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [campaignMembers, setCampaignMembers] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [selectedCustomerToAdd, setSelectedCustomerToAdd] = useState(null);

    const [newCampaign, setNewCampaign] = useState({
        campaign_name: '',
        type: '',
        start_date: '',
        end_date: '',
        status: 'Scheduled',
        target_group: ''
    });

    const fetchCampaigns = async () => {
        try {
            const response = await axiosInstance.get('crm/campaigns/');
            setCampaigns(response.data);
        } catch (error) {
            console.error("Error fetching campaigns", error);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleCreate = async () => {
        try {
            await axiosInstance.post('crm/campaigns/', newCampaign);
            setOpen(false);
            fetchCampaigns();
            setNewCampaign({
                campaign_name: '',
                type: '',
                start_date: '',
                end_date: '',
                status: 'Scheduled',
                target_group: ''
            });
        } catch (error) {
            console.error("Error creating campaign", error);
            alert("Failed to create campaign. Ensure you are a Supervisor.");
        }
    };

    const handleManageMembers = async (campaign) => {
        setSelectedCampaign(campaign);
        try {
            const [membersRes, customersRes] = await Promise.all([
                axiosInstance.get(`crm/campaigns/${campaign.campaign_id}/members/`),
                axiosInstance.get('crm/customers/')
            ]);
            setCampaignMembers(membersRes.data);
            setAllCustomers(customersRes.data);
            setMembersOpen(true);
        } catch (error) {
            console.error("Error fetching members", error);
        }
    };

    const handleAddMember = async () => {
        if (!selectedCustomerToAdd) return;
        try {
            await axiosInstance.post(`crm/campaigns/${selectedCampaign.campaign_id}/add_customer/`, {
                customer_id: selectedCustomerToAdd.customer_id
            });
            // Refresh members
            const response = await axiosInstance.get(`crm/campaigns/${selectedCampaign.campaign_id}/members/`);
            setCampaignMembers(response.data);
            setSelectedCustomerToAdd(null);
        } catch (error) {
            console.error("Error adding member", error);
        }
    };

    const handleRemoveMember = async (customerId) => {
        try {
            await axiosInstance.post(`crm/campaigns/${selectedCampaign.campaign_id}/remove_customer/`, {
                customer_id: customerId
            });
            // Refresh members
            const response = await axiosInstance.get(`crm/campaigns/${selectedCampaign.campaign_id}/members/`);
            setCampaignMembers(response.data);
        } catch (error) {
            console.error("Error removing member", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Completed': return 'default';
            case 'Scheduled': return 'info';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" gutterBottom>
                    Campaigns
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                    Create Campaign
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="campaigns table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Target Group</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {campaigns.map((campaign) => (
                            <TableRow key={campaign.campaign_id}>
                                <TableCell>#{campaign.campaign_id}</TableCell>
                                <TableCell>{campaign.campaign_name}</TableCell>
                                <TableCell>{campaign.type}</TableCell>
                                <TableCell>{campaign.target_group}</TableCell>
                                <TableCell>{campaign.start_date}</TableCell>
                                <TableCell>{campaign.end_date}</TableCell>
                                <TableCell>
                                    <Chip label={campaign.status} color={getStatusColor(campaign.status)} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        size="small" 
                                        startIcon={<GroupIcon />}
                                        onClick={() => handleManageMembers(campaign)}
                                    >
                                        Members
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {campaigns.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No campaigns found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Campaign Name"
                        fullWidth
                        value={newCampaign.campaign_name}
                        onChange={(e) => setNewCampaign({ ...newCampaign, campaign_name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Type"
                        fullWidth
                        value={newCampaign.type}
                        onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Target Group"
                        fullWidth
                        value={newCampaign.target_group}
                        onChange={(e) => setNewCampaign({ ...newCampaign, target_group: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newCampaign.start_date}
                        onChange={(e) => setNewCampaign({ ...newCampaign, start_date: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newCampaign.end_date}
                        onChange={(e) => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Status"
                        fullWidth
                        value={newCampaign.status}
                        onChange={(e) => setNewCampaign({ ...newCampaign, status: e.target.value })}
                    >
                        <MenuItem value="Scheduled">Scheduled</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            {/* Manage Members Dialog */}
            <Dialog open={membersOpen} onClose={() => setMembersOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Manage Members - {selectedCampaign?.campaign_name}</DialogTitle>
                <DialogContent>
                    <Box display="flex" gap={1} mb={2} mt={1}>
                        <Autocomplete
                            options={allCustomers}
                            getOptionLabel={(option) => `${option.full_name} (${option.email})`}
                            value={selectedCustomerToAdd}
                            onChange={(event, newValue) => setSelectedCustomerToAdd(newValue)}
                            renderInput={(params) => <TextField {...params} label="Select Customer" size="small" />}
                            sx={{ flexGrow: 1 }}
                        />
                        <Button variant="contained" onClick={handleAddMember} disabled={!selectedCustomerToAdd}>
                            Add
                        </Button>
                    </Box>
                    <Divider />
                    <List>
                        {campaignMembers.map((member) => (
                            <ListItem key={member.customer_id}>
                                <ListItemText 
                                    primary={member.full_name} 
                                    secondary={member.email} 
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMember(member.customer_id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                        {campaignMembers.length === 0 && (
                            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                                No members in this campaign.
                            </Typography>
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMembersOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Campaigns;
