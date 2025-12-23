import React from 'react';
import { 
    Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, 
    ListItemIcon, ListItemText, Divider, CssBaseline 
} from '@mui/material';
import { 
    Dashboard as DashboardIcon, 
    ConfirmationNumber as TicketIcon, 
    People as PeopleIcon, 
    ExitToApp as LogoutIcon,
    Phone as PhoneIcon,
    Campaign as CampaignIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';

const drawerWidth = 240;

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        SafeCall CRM
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button onClick={() => navigate('/dashboard')}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/tickets')}>
                            <ListItemIcon>
                                <TicketIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tickets" />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/campaigns')}>
                            <ListItemIcon>
                                <CampaignIcon />
                            </ListItemIcon>
                            <ListItemText primary="Campaigns" />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/customers')}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Customers" />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/call-history')}>
                            <ListItemIcon>
                                <PhoneIcon />
                            </ListItemIcon>
                            <ListItemText primary="Call History" />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/security-logs')}>
                            <ListItemIcon>
                                <SecurityIcon />
                            </ListItemIcon>
                            <ListItemText primary="Security Logs" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
