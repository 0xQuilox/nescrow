import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Paper,
  Container,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Add as AddIcon, 
  List as ListIcon, 
  Explore as ExploreIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  AccountBalance as AccountBalanceIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function Home() {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const theme = useTheme();
  
  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, md: 8 }, 
          mb: 8, 
          borderRadius: 4, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: `linear-gradient(to top, ${alpha(theme.palette.primary.dark, 0.9)}, transparent)`,
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              mb: 3,
              background: 'linear-gradient(90deg, #ffffff, #ffc107)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Secure Wagering on Solana
          </Typography>
          
          <Typography 
            variant="h6" 
            paragraph 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              mb: 5,
              opacity: 0.9,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Nescrow provides a trustless escrow system for creating and accepting wagers on the Solana blockchain.
            Create, accept, and settle wagers with confidence.
          </Typography>
          
          {connected ? (
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create')}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: '0 4px 20px rgba(255, 193, 7, 0.4)',
              }}
            >
              Create a Wager
            </Button>
          ) : (
            <WalletMultiButton />
          )}
        </Container>
      </Paper>
      
      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 5, 
            textAlign: 'center',
            position: 'relative',
            display: 'inline-block',
            left: '50%',
            transform: 'translateX(-50%)',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '25%',
              width: '50%',
              height: 4,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #9c27b0, #ffc107)',
            }
          }}
        >
          How It Works
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)`,
                zIndex: 0,
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  mb: 3 
                }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      mb: 3,
                      background: alpha(theme.palette.primary.main, 0.1),
                      boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.05)}`,
                    }}
                  >
                    <SecurityIcon 
                      color="primary" 
                      sx={{ 
                        fontSize: 40,
                        filter: 'drop-shadow(0 2px 5px rgba(156, 39, 176, 0.4))'
                      }} 
                    />
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    Secure Escrow
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                  Funds are held securely in program-derived accounts on the Solana blockchain until the wager is resolved.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)`,
                zIndex: 0,
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  mb: 3 
                }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      mb: 3,
                      background: alpha(theme.palette.primary.main, 0.1),
                      boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.05)}`,
                    }}
                  >
                    <SpeedIcon 
                      color="primary" 
                      sx={{ 
                        fontSize: 40,
                        filter: 'drop-shadow(0 2px 5px rgba(156, 39, 176, 0.4))'
                      }} 
                    />
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    Fast & Low Cost
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                  Benefit from Solana's high speed and low transaction costs when creating and settling wagers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)`,
                zIndex: 0,
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  mb: 3 
                }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      mb: 3,
                      background: alpha(theme.palette.primary.main, 0.1),
                      boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.05)}`,
                    }}
                  >
                    <AccountBalanceIcon 
                      color="primary" 
                      sx={{ 
                        fontSize: 40,
                        filter: 'drop-shadow(0 2px 5px rgba(156, 39, 176, 0.4))'
                      }} 
                    />
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    Trustless System
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                  No intermediaries or third parties. The smart contract handles all fund transfers based on the agreed terms.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Call to Action Section */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 5, 
            textAlign: 'center',
            position: 'relative',
            display: 'inline-block',
            left: '50%',
            transform: 'translateX(-50%)',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '25%',
              width: '50%',
              height: 4,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #9c27b0, #ffc107)',
            }
          }}
        >
          Get Started
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.3)',
              }
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom
                  sx={{ 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: theme.palette.secondary.main,
                    fontWeight: 'bold'
                  }}
                >
                  <AddIcon /> Create a Wager
                </Typography>
                <Typography variant="body1" paragraph>
                  Set up a new wager by specifying the amount, description, and expiry time. Your funds will be securely held in escrow.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/create')}
                >
                  Create Wager
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.3)',
              }
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom
                  sx={{ 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: theme.palette.secondary.main,
                    fontWeight: 'bold'
                  }}
                >
                  <ListIcon /> My Wagers
                </Typography>
                <Typography variant="body1" paragraph>
                  View and manage all your created and accepted wagers in one place. Track their status and take actions as needed.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/my-escrows')}
                >
                  My Wagers
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.3)',
              }
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom
                  sx={{ 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: theme.palette.secondary.main,
                    fontWeight: 'bold'
                  }}
                >
                  <ExploreIcon /> Open Wagers
                </Typography>
                <Typography variant="body1" paragraph>
                  Browse all open wagers available for acceptance on the platform. Find opportunities that match your interests.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/open-escrows')}
                >
                  Browse Wagers
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;