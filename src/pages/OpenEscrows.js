import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Alert, 
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNescrow } from '../contexts/NescrowContext';
import EscrowCard from '../components/EscrowCard';

function OpenEscrows() {
  const { publicKey } = useWallet();
  const { openEscrows, loading } = useNescrow();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Filter and sort escrows
  const getFilteredAndSortedEscrows = () => {
    if (!openEscrows) return [];
    
    // Filter by search term
    let filtered = openEscrows;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = openEscrows.filter(({ account }) => 
        account.description.toLowerCase().includes(term)
      );
    }
    
    // Filter out escrows created by the current user
    if (publicKey) {
      filtered = filtered.filter(({ account }) => 
        !account.creator.equals(publicKey)
      );
    }
    
    // Sort escrows
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // Sort by counter (higher is newer)
          return Number(b.account.counter - a.account.counter);
        case 'oldest':
          // Sort by counter (lower is older)
          return Number(a.account.counter - b.account.counter);
        case 'amountHigh':
          // Sort by amount (high to low)
          return Number(b.account.amount - a.account.amount);
        case 'amountLow':
          // Sort by amount (low to high)
          return Number(a.account.amount - b.account.amount);
        case 'expiryClosest':
          // Sort by expiry time (closest first)
          return Number(a.account.expiryTime - b.account.expiryTime);
        default:
          return 0;
      }
    });
  };
  
  const filteredAndSortedEscrows = getFilteredAndSortedEscrows();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Open Wagers
      </Typography>
      
      <Typography variant="body1" paragraph color="text.secondary">
        Browse all open wagers available for acceptance.
      </Typography>
      
      {/* Search and Filter */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="amountHigh">Amount (High to Low)</MenuItem>
                  <MenuItem value="amountLow">Amount (Low to High)</MenuItem>
                  <MenuItem value="expiryClosest">Expiring Soon</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {!publicKey ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please connect your wallet to accept wagers.
        </Alert>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredAndSortedEscrows.length === 0 ? (
        <Alert severity="info">
          No open wagers found. Check back later or create your own!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredAndSortedEscrows.map(({ pubkey, account }) => (
            <Grid item xs={12} sm={6} md={4} key={pubkey.toString()}>
              <EscrowCard escrow={account} pubkey={pubkey} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default OpenEscrows;