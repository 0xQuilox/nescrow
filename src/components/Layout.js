import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
  alpha
} from '@mui/material';
import { 
  Home as HomeIcon,
  Add as AddIcon,
  List as ListIcon,
  Explore as ExploreIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NescrowProvider } from '../contexts/NescrowContext';

const navItems = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Create Wager', path: '/create', icon: <AddIcon /> },
  { name: 'My Wagers', path: '/my-escrows', icon: <ListIcon /> },
  { name: 'Open Wagers', path: '/open-escrows', icon: <ExploreIcon /> },
];

function Layout({ children }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{ 
        width: 280,
        height: '100%',
        background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        position: 'relative'
      }}>
        <IconButton 
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8,
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
          onClick={toggleDrawer(false)}
        >
          <CloseIcon />
        </IconButton>
        
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64, 
            mb: 2,
            background: 'linear-gradient(45deg, #9c27b0 30%, #ffc107 90%)',
            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
          }}
        >
          <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>
            N
          </Typography>
        </Avatar>
        
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }} className="gradient-text">
          Nescrow
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Solana Wagering Escrow
        </Typography>
        
        <Box sx={{ width: '100%', mb: 2 }}>
          <WalletMultiButton />
        </Box>
      </Box>
      
      <Divider sx={{ borderColor: alpha(theme.palette.primary.main, 0.1) }} />
      
      <List sx={{ px: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem 
              button 
              key={item.name} 
              component={RouterLink} 
              to={item.path}
              sx={{
                borderRadius: 2,
                mb: 1,
                background: isActive ? 
                  `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.15)}, transparent)` : 
                  'transparent',
                '&:hover': {
                  background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
                },
                position: 'relative',
                overflow: 'hidden',
                '&::before': isActive ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: 'linear-gradient(180deg, #9c27b0, #ffc107)',
                  borderRadius: '4px',
                } : {}
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive ? 'primary.main' : 'text.secondary',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'text.primary' : 'text.secondary'
                }} 
              />
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ p: 3, mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Nescrow
        </Typography>
      </Box>
    </Box>
  );

  return (
    <NescrowProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 1.5,
                  display: { xs: 'none', sm: 'flex' },
                  background: 'linear-gradient(45deg, #9c27b0 30%, #ffc107 90%)',
                }}
              >
                <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                  N
                </Typography>
              </Avatar>
              
              <Typography 
                variant="h6" 
                component={RouterLink} 
                to="/"
                sx={{ 
                  fontWeight: 'bold', 
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
                className="gradient-text"
              >
                Nescrow
              </Typography>
            </Box>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, mx: 'auto', ml: 4 }}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.name}
                      component={RouterLink}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{ 
                        color: isActive ? 'primary.light' : 'text.secondary',
                        fontWeight: isActive ? 600 : 400,
                        position: 'relative',
                        '&::after': isActive ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '30%',
                          height: 3,
                          background: 'linear-gradient(90deg, #9c27b0, #ffc107)',
                          borderRadius: '2px 2px 0 0',
                        } : {},
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.05),
                          color: 'primary.light'
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  );
                })}
              </Box>
            )}
            
            <Box sx={{ ml: 'auto' }}>
              <WalletMultiButton />
            </Box>
          </Toolbar>
        </AppBar>
        
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              width: 280,
              background: 'transparent',
              border: 'none',
            }
          }}
        >
          {drawer}
        </Drawer>
        
        <Container 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            py: 4, 
            px: { xs: 2, sm: 4 },
            maxWidth: { xl: 1400 }
          }}
        >
          {children}
        </Container>
        
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            textAlign: 'center',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mt: 'auto'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Nescrow - Solana Wagering Escrow
          </Typography>
        </Box>
      </Box>
    </NescrowProvider>
  );
}

export default Layout;