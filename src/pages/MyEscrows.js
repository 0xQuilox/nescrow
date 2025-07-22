import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Alert, 
  CircularProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNescrow } from '../contexts/NescrowContext';
import EscrowCard from '../components/EscrowCard';

// Status mapping for filtering
const STATUS = {
  OPEN: 0,
  ACCEPTED: 1,
  COMPLETED: 2,
  CANCELLED: 3
};

function MyEscrows() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { myEscrows, loading } = useNescrow();
  const [tabValue, setTabValue] = useState(0);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Filter escrows based on tab
  const getFilteredEscrows = () => {
    if (!myEscrows) return [];
    
    switch (tabValue) {
      case 0: // All
        return myEscrows;
      case 1: // Open
        return myEscrows.filter(e => e.account.status === STATUS.OPEN);
      case 2: // Accepted
        return myEscrows.filter(e => e.account.status === STATUS.ACCEPTED);
      case 3: // Completed
        return myEscrows.filter(e => e.account.status === STATUS.COMPLETED);
      case 4: // Cancelled
        return myEscrows.filter(e => e.account.status === STATUS.CANCELLED);
      default:
        return myEscrows;
    }
  };
  
  const filteredEscrows = getFilteredEscrows();
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Wagers
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
        >
          Create Wager
        </Button>
      </Box>
      
      {!publicKey ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please connect your wallet to view your wagers.
        </Alert>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab label="All" />
            <Tab label="Open" />
            <Tab label="Accepted" />
            <Tab label="Completed" />
            <Tab label="Cancelled" />
          </Tabs>
          
          <Divider sx={{ mb: 3 }} />
          
          {filteredEscrows.length === 0 ? (
            <Alert severity="info">
              {tabValue === 0 
                ? "You don't have any wagers yet. Create one to get started!" 
                : "No wagers found with this status."}
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredEscrows.map(({ pubkey, account }) => (
                <Grid item xs={12} sm={6} md={4} key={pubkey.toString()}>
                  <EscrowCard escrow={account} pubkey={pubkey} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}

export default MyEscrows;