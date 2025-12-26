import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { 
    Container, Grid, Paper, Typography, Box, 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, CircularProgress, Alert 
} from '@mui/material';
import { 
    People as PeopleIcon, 
    Phone as PhoneIcon, 
    ConfirmationNumber as TicketIcon,
    CheckCircle as ResolvedIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography color="textSecondary" gutterBottom variant="h6">
                {title}
            </Typography>
            <Box sx={{ color: color }}>
                {icon}
            </Box>
        </Box>
        <Typography component="p" variant="h4">
            {value}
        </Typography>
    </Paper>
);

const SupervisorDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('crm/supervisor/stats/');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching supervisor stats", err);
                setError("Failed to load supervisor data. Are you a supervisor?");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Supervisor Dashboard
            </Typography>
            
            {/* Overall Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <StatCard 
                        title="Total Calls" 
                        value={data.stats.total_calls} 
                        icon={<PhoneIcon fontSize="large" />}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard 
                        title="Total Tickets" 
                        value={data.stats.total_tickets} 
                        icon={<TicketIcon fontSize="large" />}
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard 
                        title="Open Tickets" 
                        value={data.stats.open_tickets} 
                        icon={<TicketIcon fontSize="large" />}
                        color="#d32f2f"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard 
                        title="Resolved Tickets" 
                        value={data.stats.resolved_tickets} 
                        icon={<ResolvedIcon fontSize="large" />}
                        color="#2e7d32"
                    />
                </Grid>
            </Grid>

            {/* Agent Performance Table */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Agent Performance
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Agent Name</TableCell>
                            <TableCell align="right">Calls Taken</TableCell>
                            <TableCell align="right">Tickets Assigned</TableCell>
                            <TableCell align="right">Tickets Resolved</TableCell>
                            <TableCell align="right">Resolution Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.agents.map((agent) => {
                            const resolutionRate = agent.tickets_assigned > 0 
                                ? Math.round((agent.tickets_resolved / agent.tickets_assigned) * 100) 
                                : 0;
                            
                            return (
                                <TableRow key={agent.id}>
                                    <TableCell component="th" scope="row">
                                        {agent.full_name} ({agent.username})
                                    </TableCell>
                                    <TableCell align="right">{agent.calls_count}</TableCell>
                                    <TableCell align="right">{agent.tickets_assigned}</TableCell>
                                    <TableCell align="right">{agent.tickets_resolved}</TableCell>
                                    <TableCell align="right">{resolutionRate}%</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default SupervisorDashboard;
